import { useCallback, useMemo, useState } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getDynamicData } from "@shared/services/dynamic";
import { DEFAULT_PAGE_SIZES } from "../core/constants";
import type {
  GridFilterState,
  GridSortState,
  ServerGridState,
} from "../types/props";
import { mapRequest } from "../utils/mapRequest";

/** Một trang dữ liệu đã chuẩn hóa mà grid tiêu thụ */
export type ServerPage<T> = { data: T[]; total: number };

export type UseServerGridOptions<T> = {
  /**
   * Nguồn dữ liệu tùy biến — nhận nguyên ServerGridState (filters mang operator
   * FE thô: contains/eq/gt/lt), trả { data, total }. Dùng khi nối grid với một
   * API bất kỳ (kể cả server giả lập). Không truyền → mặc định gọi
   * POST /dynamic/get-data với tableNames bên dưới.
   */
  fetcher?: (state: ServerGridState) => Promise<ServerPage<T>>;
  /** Tên bảng/view Postgres cho đường mặc định, vd "rooms" — bắt buộc nếu không có fetcher */
  tableNames?: string;
  /**
   * Prefix queryKey React Query — chuỗi hoặc mảng key của feature
   * (vd `serviceKeys.grid()`), grid nối thêm tableNames + gridState vào sau.
   */
  queryKey: string | readonly unknown[];
  initialPageSize?: number;
  initialSorts?: GridSortState[];
  fields?: string;
  searchFields?: string;
  /** Filter cố định, merge với filter của grid (chỉ áp cho đường mặc định) */
  staticFilters?: GridFilterState[];
  /** Map field FE → tên cột view (snake_case) khi camelToSnake không khớp */
  serverFields?: Record<string, string>;
  /** Lấy id dòng — mặc định đọc row.id (dùng cho updateRow/removeRow...) */
  getRowId?: (row: T) => string;
  enabled?: boolean;
};

export type UseServerGridResult<T> = {
  data: T[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  gridState: ServerGridState;
  setGridState: (next: ServerGridState) => void;
  refetch: () => void;

  // ===== Row mutation: ghi vào React Query cache (KHÔNG mutate ngoài cache) =====
  updateRow: (id: string, partial: Partial<T>) => void;
  replaceRow: (id: string, row: T) => void;
  /** Chèn optimistic vào trang hiện tại, total + 1 — nên refetch() sau khi server xác nhận */
  addRow: (row: T, position?: "start" | "end") => void;
  /** Gỡ khỏi trang hiện tại, total - 1 — nên refetch() sau khi server xác nhận */
  removeRow: (id: string) => void;
  getRowById: (id: string) => T | undefined;
};

const defaultGetRowId = (row: unknown): string =>
  String((row as { id?: unknown })?.id ?? "");

/**
 * Nối DataGrid (server mode) với nguồn dữ liệu qua React Query.
 * gridState nằm trong queryKey → đổi trang/sort/lọc là tự refetch;
 * keepPreviousData giữ trang cũ trong lúc tải, không nháy trắng.
 */
export const useServerGrid = <T,>(
  options: UseServerGridOptions<T>,
): UseServerGridResult<T> => {
  const [gridState, setGridState] = useState<ServerGridState>({
    pageNumber: 1,
    pageSize: options.initialPageSize ?? DEFAULT_PAGE_SIZES[0],
    sorts: options.initialSorts ?? [],
    filters: [],
  });

  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => [
      ...(typeof options.queryKey === "string"
        ? [options.queryKey]
        : options.queryKey),
      options.tableNames ?? "custom",
      gridState,
    ],
    [options.queryKey, options.tableNames, gridState],
  );

  const { fetcher } = options;
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<ServerPage<T>> => {
      if (fetcher) return fetcher(gridState);
      if (!options.tableNames) {
        throw new Error("useServerGrid cần `tableNames` khi không truyền `fetcher`");
      }
      const res = await getDynamicData<T[]>(
        mapRequest(
          {
            tableNames: options.tableNames,
            fields: options.fields,
            searchFields: options.searchFields,
            staticFilters: options.staticFilters,
            serverFields: options.serverFields,
          },
          gridState,
        ),
      );
      return { data: res.data, total: Number(res.total ?? 0) };
    },
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });

  const getRowId = options.getRowId ?? defaultGetRowId;

  const mutatePage = useCallback(
    (mutator: (page: ServerPage<T>) => ServerPage<T>) => {
      queryClient.setQueryData<ServerPage<T>>(queryKey, (old) =>
        old ? mutator(old) : old,
      );
    },
    [queryClient, queryKey],
  );

  const updateRow = useCallback(
    (id: string, partial: Partial<T>) =>
      mutatePage((page) => ({
        ...page,
        data: page.data.map((r) =>
          getRowId(r) === id ? { ...r, ...partial } : r,
        ),
      })),
    [mutatePage, getRowId],
  );

  const replaceRow = useCallback(
    (id: string, row: T) =>
      mutatePage((page) => ({
        ...page,
        data: page.data.map((r) => (getRowId(r) === id ? row : r)),
      })),
    [mutatePage, getRowId],
  );

  const addRow = useCallback(
    (row: T, position: "start" | "end" = "start") =>
      mutatePage((page) => ({
        data: position === "start" ? [row, ...page.data] : [...page.data, row],
        total: page.total + 1,
      })),
    [mutatePage],
  );

  const removeRow = useCallback(
    (id: string) =>
      mutatePage((page) => ({
        data: page.data.filter((r) => getRowId(r) !== id),
        total: Math.max(0, page.total - 1),
      })),
    [mutatePage, getRowId],
  );

  const getRowById = useCallback(
    (id: string) => query.data?.data.find((r) => getRowId(r) === id),
    [query.data, getRowId],
  );

  return {
    data: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    gridState,
    setGridState,
    refetch: () => void query.refetch(),
    updateRow,
    replaceRow,
    addRow,
    removeRow,
    getRowById,
  };
};

export type { GridFilterState, GridSortState, ServerGridState };
