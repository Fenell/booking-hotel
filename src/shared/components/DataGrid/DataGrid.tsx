import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnFiltersState,
  ColumnPinningState,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import classNames from "classnames";

import BodyRows from "./body/BodyRows";
import EmptyState from "./body/EmptyState";
import LoadingOverlay from "./body/LoadingOverlay";
import { buildColumns } from "./core/buildColumns";
import { DEFAULT_PAGE_SIZES, SELECT_COL_ID } from "./core/constants";
import { GridContextProvider } from "./core/gridContext";
import type { GridContextValue } from "./core/gridContext";
import { applyOverrides, inferColumns } from "./core/inferColumns";
import FooterRow from "./footer/FooterRow";
import HeaderRow from "./header/HeaderRow";
import { useGridPersistence } from "./hooks/useGridPersistence";
import { useGridRef } from "./hooks/useGridRef";
import Pager from "./pagination/Pager";
import bodyStyles from "./styles/body.module.css";
import overlayStyles from "./styles/overlay.module.css";
import rootStyles from "./styles/root.module.css";
import ColumnChooser from "./toolbar/ColumnChooser";
import type { ColumnDef } from "./types/column";
import type { PersistedColumnState } from "./types/persist";
import type {
  DataGridProps,
  GridFilterState,
  ServerGridState,
} from "./types/props";
import { loadPersisted, mergePersisted, removePersisted } from "./utils/persist";

/**
 * DataGrid tự dựng — lõi TanStack Table v8, giao diện kiểu AG Grid (Quartz-like).
 *
 * Hai chế độ:
 * - Server-side (mặc định khi có onStateChange): grid CONTROLLED theo ServerGridState,
 *   mọi thay đổi trang/sort/lọc phát qua onStateChange — thường nối với useServerGrid.
 * - Client-side: truyền cả dataSource vào `data`, grid tự sort/lọc/phân trang.
 *
 * Không truyền `columns` → tự sinh cột từ dữ liệu (map động), chỉnh bằng columnOverrides.
 */
const DataGrid = <T,>(props: DataGridProps<T>) => {
  const {
    columns,
    columnOverrides,
    data,
    getRowId,
    gridKey,
    serverSide: serverSideProp,
    rowCount,
    state,
    onStateChange,
    isLoading = false,
    isFetching = false,
    pageSizeOptions = DEFAULT_PAGE_SIZES,
    enableSelection = false,
    selectedRowIds,
    onSelectionChange,
    footerData,
    footerLabel,
    enableResize = true,
    enableSort = true,
    enableFilter = true,
    enableColumnChooser = true,
    enablePinning = true,
    height,
    emptyMessage = "Không có dữ liệu",
    className,
    onRowClick,
    onRowDoubleClick,
    rowClassName,
    rowHeight,
    toolbarLeft,
    ref,
  } = props;

  const serverSide = serverSideProp ?? !!onStateChange;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headerViewportRef = useRef<HTMLDivElement | null>(null);
  const footerViewportRef = useRef<HTMLDivElement | null>(null);

  /** Cuộn ngang ở body → kéo header/footer chạy theo */
  const handleBodyScroll = () => {
    const left = scrollRef.current?.scrollLeft ?? 0;
    if (headerViewportRef.current) headerViewportRef.current.scrollLeft = left;
    if (footerViewportRef.current) footerViewportRef.current.scrollLeft = left;
  };

  // Đo bề rộng thanh cuộn dọc của body → CSS var --dg-sbw cho spacer
  // header/footer (scrollbar-gutter không áp dụng được cho overflow:hidden).
  // ResizeObserver bắt cả trường hợp scrollbar xuất hiện/mất do resize cửa sổ.
  useEffect(() => {
    const body = scrollRef.current;
    const root = rootRef.current;
    if (!body || !root) return;
    const sync = () => {
      const w = body.offsetWidth - body.clientWidth;
      root.style.setProperty("--dg-sbw", `${w}px`);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(body);
    return () => ro.disconnect();
  }, []);


  // ===== Cột: khai báo tay hoặc tự sinh từ shape dữ liệu =====
  // Chỉ infer lại khi shape (danh sách key) của record đầu thay đổi
  const inferKey =
    columns?.length || data[0] == null
      ? ""
      : Object.keys(data[0] as object).join("|");

  // Giữ bộ cột auto-sinh gần nhất: filter/refetch trả trang RỖNG không được
  // xóa cột (mất luôn ô lọc, người dùng kẹt không gỡ filter được)
  const lastInferredRef = useRef<ColumnDef<T>[]>([]);
  const colDefs = useMemo<ColumnDef<T>[]>(() => {
    if (columns?.length) return applyOverrides(columns, columnOverrides);
    const inferred = inferColumns(data, columnOverrides);
    if (inferred.length) lastInferredRef.current = inferred;
    return lastInferredRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, columnOverrides, inferKey]);

  const colDefFor = useCallback(
    (columnId: string) => colDefs.find((c) => c.field === columnId),
    [colDefs],
  );

  const builtColumns = useMemo(
    () => buildColumns(colDefs, enableSelection),
    [colDefs, enableSelection],
  );

  // ===== Trạng thái cột (order/visibility/sizing) + persist =====
  const [initState] = useState(() =>
    mergePersisted(gridKey ? loadPersisted(gridKey) : null, colDefs),
  );
  const [columnOrder, setColumnOrderRaw] = useState<string[]>(
    initState.columnOrder,
  );
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(initState.columnVisibility);
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>(
    initState.columnSizing,
  );

  // Cột auto-sinh: data đến sau mount → init lại một lần khi colDefs xuất hiện
  const initializedRef = useRef(colDefs.length > 0);
  useEffect(() => {
    if (initializedRef.current || colDefs.length === 0) return;
    initializedRef.current = true;
    const init = mergePersisted(gridKey ? loadPersisted(gridKey) : null, colDefs);
    setColumnOrderRaw(init.columnOrder);
    setColumnVisibility(init.columnVisibility);
    setColumnSizing(init.columnSizing);
  }, [colDefs, gridKey]);

  useGridPersistence(gridKey, { columnOrder, columnVisibility, columnSizing });

  // columnOrder lưu KHÔNG gồm cột checkbox; khi render thì chèn nó lên đầu
  const effectiveColumnOrder = useMemo(() => {
    if (!columnOrder.length) return columnOrder;
    return enableSelection ? [SELECT_COL_ID, ...columnOrder] : columnOrder;
  }, [columnOrder, enableSelection]);

  const handleColumnOrderChange: OnChangeFn<string[]> = (updater) => {
    const next =
      typeof updater === "function" ? updater(effectiveColumnOrder) : updater;
    setColumnOrderRaw(next.filter((id) => id !== SELECT_COL_ID));
  };

  // ===== Pinning: cột checkbox luôn ghim trái ngoài cùng =====
  const computePinning = useCallback(
    (): ColumnPinningState => ({
      left: [
        ...(enableSelection ? [SELECT_COL_ID] : []),
        ...(enablePinning
          ? colDefs.filter((c) => c.pinned === "left").map((c) => c.field)
          : []),
      ],
      right: enablePinning
        ? colDefs.filter((c) => c.pinned === "right").map((c) => c.field)
        : [],
    }),
    [colDefs, enableSelection, enablePinning],
  );
  const [columnPinning, setColumnPinning] =
    useState<ColumnPinningState>(computePinning);
  // Key theo NỘI DUNG pin — colDefs đổi identity (columns/overrides inline không
  // memo) sẽ không clobber trạng thái pin do ref.pinColumn đặt
  const pinKey = [
    enableSelection,
    enablePinning,
    colDefs.filter((c) => c.pinned === "left").map((c) => c.field).join(),
    colDefs.filter((c) => c.pinned === "right").map((c) => c.field).join(),
  ].join("|");
  useEffect(() => {
    setColumnPinning(computePinning());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinKey]);

  // ===== ServerGridState hiện hành (server mode) =====
  const defaultServerState = useMemo<ServerGridState>(
    () => ({
      pageNumber: 1,
      pageSize: pageSizeOptions[0] ?? 20,
      sorts: [],
      filters: [],
    }),
    [pageSizeOptions],
  );
  const currentServerState = state ?? defaultServerState;
  const serverStateRef = useRef(currentServerState);
  serverStateRef.current = currentServerState;

  const emitState = useCallback(
    (patch: Partial<ServerGridState>) => {
      // Ghi ref NGAY khi emit — hai emit trong cùng một tick (vd ref.setFilter
      // rồi ref.setSort liên tiếp) sẽ merge chồng nhau thay vì nuốt patch trước
      const merged = { ...serverStateRef.current, ...patch };
      serverStateRef.current = merged;
      onStateChange?.(merged);
    },
    [onStateChange],
  );

  // ===== Sorting =====
  const [clientSorting, setClientSorting] = useState<SortingState>([]);
  const sorting = useMemo<SortingState>(
    () =>
      serverSide
        ? currentServerState.sorts.map((s) => ({
            id: s.field,
            desc: s.direction === "desc",
          }))
        : clientSorting,
    [serverSide, currentServerState.sorts, clientSorting],
  );

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    if (serverSide) {
      emitState({
        sorts: next.map((s) => ({
          field: s.id,
          direction: s.desc ? "desc" : "asc",
        })),
        pageNumber: 1, // đổi sort → về trang 1
      });
    } else {
      setClientSorting(next);
    }
  };

  // ===== Pagination =====
  const [clientPagination, setClientPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizeOptions[0] ?? 20,
  });
  const pagination = useMemo<PaginationState>(
    () =>
      serverSide
        ? {
            pageIndex: currentServerState.pageNumber - 1,
            pageSize: currentServerState.pageSize,
          }
        : clientPagination,
    [serverSide, currentServerState.pageNumber, currentServerState.pageSize, clientPagination],
  );

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    // đổi cỡ trang → về trang 1
    const pageIndex = next.pageSize !== pagination.pageSize ? 0 : next.pageIndex;
    if (serverSide) {
      emitState({ pageNumber: pageIndex + 1, pageSize: next.pageSize });
    } else {
      setClientPagination({ pageIndex, pageSize: next.pageSize });
    }
  };

  // ===== Filter: MỘT nguồn sự thật cho UI cả 2 chế độ =====
  const [filterState, setFilterState] = useState<
    Record<string, GridFilterState>
  >(() =>
    Object.fromEntries((state?.filters ?? []).map((f) => [f.field, f])),
  );
  const filterStateRef = useRef(filterState);

  // Server mode: parent có thể đổi state.filters từ NGOÀI (vd setGridState reset
  // lọc) — đồng bộ ngược vào filterState để ô lọc không hiển thị giá trị "ma".
  // Chỉ sync khi prop khác bản grid đang giữ (thay đổi do chính grid phát thì bỏ qua).
  const propFiltersJson = serverSide ? JSON.stringify(state?.filters ?? []) : "";
  const [prevPropFiltersJson, setPrevPropFiltersJson] = useState(propFiltersJson);
  if (propFiltersJson !== prevPropFiltersJson) {
    setPrevPropFiltersJson(propFiltersJson);
    if (
      serverSide &&
      propFiltersJson !== JSON.stringify(Object.values(filterStateRef.current))
    ) {
      const next = Object.fromEntries(
        (state?.filters ?? []).map((f) => [f.field, f]),
      );
      filterStateRef.current = next;
      setFilterState(next);
    }
  }

  const setFilter = useCallback(
    (field: string, operator: string, value: string) => {
      const next = { ...filterStateRef.current };
      if (!value) delete next[field];
      else next[field] = { field, operator, value };
      filterStateRef.current = next;
      setFilterState(next);
      if (serverSide) {
        emitState({ filters: Object.values(next), pageNumber: 1 });
      } else {
        // client: lọc lại → về trang 1
        setClientPagination((p) => ({ ...p, pageIndex: 0 }));
      }
    },
    [serverSide, emitState],
  );

  const clearAllFilters = useCallback(() => {
    filterStateRef.current = {};
    setFilterState({});
    if (serverSide) emitState({ filters: [], pageNumber: 1 });
    else setClientPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [serverSide, emitState]);

  const columnFilters = useMemo<ColumnFiltersState>(
    () =>
      Object.values(filterState).map((f) => ({
        id: f.field,
        value: { operator: f.operator, value: f.value },
      })),
    [filterState],
  );

  // ===== Selection =====
  const [internalSelection, setInternalSelection] = useState<RowSelectionState>(
    {},
  );
  const rowSelection = selectedRowIds ?? internalSelection;
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const next = typeof updater === "function" ? updater(rowSelection) : updater;
    setInternalSelection(next);
    onSelectionChange?.(next);
  };

  // ===== Table instance =====
  const table = useReactTable<T>({
    data,
    columns: builtColumns,
    getRowId: (row) => getRowId(row),
    state: {
      sorting,
      pagination,
      columnFilters,
      rowSelection,
      columnVisibility,
      columnSizing,
      columnOrder: effectiveColumnOrder,
      columnPinning,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange: handleRowSelectionChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onColumnOrderChange: handleColumnOrderChange,
    onColumnPinningChange: setColumnPinning,
    manualSorting: serverSide,
    manualFiltering: serverSide,
    manualPagination: serverSide,
    rowCount: serverSide ? (rowCount ?? 0) : undefined,
    autoResetPageIndex: false,
    enableSorting: enableSort,
    enableSortingRemoval: true, // asc → desc → none
    sortDescFirst: false, // v8 mặc định desc-first cho cột số — ép đồng nhất
    enableMultiSort: false,
    enableRowSelection: enableSelection,
    enableColumnResizing: enableResize,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Client mode: data co lại làm pageIndex vượt pageCount (autoResetPageIndex
  // tắt) → clamp về trang cuối, tránh kẹt ở trang rỗng "Không có dữ liệu"
  if (!serverSide) {
    const pageCount = table.getPageCount();
    if (pageCount > 0 && clientPagination.pageIndex > pageCount - 1) {
      setClientPagination((prev) => ({ ...prev, pageIndex: pageCount - 1 }));
    }
  }

  // ===== Reset / apply column state (dùng cho ref) =====
  const resetColumnStates = useCallback(() => {
    if (gridKey) removePersisted(gridKey);
    const defaults = mergePersisted(null, colDefs);
    setColumnOrderRaw(defaults.columnOrder);
    setColumnVisibility(defaults.columnVisibility);
    setColumnSizing(defaults.columnSizing);
  }, [gridKey, colDefs]);

  const applyColumnState = useCallback((cols: PersistedColumnState[]) => {
    setColumnOrderRaw(cols.map((c) => c.field));
    setColumnVisibility(
      Object.fromEntries(cols.map((c) => [c.field, c.visible])),
    );
    setColumnSizing(
      Object.fromEntries(
        cols
          .filter((c) => c.width != null)
          .map((c) => [c.field, c.width as number]),
      ),
    );
  }, []);

  useGridRef(ref, {
    table,
    colDefs,
    scrollRef,
    colDefFor,
    setFilter,
    clearAllFilters,
    resetColumnStates,
    applyColumnState,
    columnOrder,
    flashClass: bodyStyles.trFlash,
  });

  // ===== Context =====
  const hasFilterRow = enableFilter && colDefs.some((c) => c.filter);
  const hasFooter = footerData != null || colDefs.some((c) => c.aggregate);

  const ctxValue: GridContextValue<T> = {
    table,
    serverSide,
    enableSort,
    enableFilter,
    enableResize,
    enableSelection,
    hasFilterRow,
    filterState,
    setFilter,
    colDefFor,
    emptyMessage,
    footerData,
    footerLabel,
    hasFooter,
    data,
    onRowClick,
    onRowDoubleClick,
    rowClassName,
    getRowId,
  };

  const rows = table.getRowModel().rows;
  const showEmpty = !isLoading && rows.length === 0;

  return (
    <GridContextProvider value={ctxValue}>
      <div
        ref={rootRef}
        className={classNames(rootStyles.root, className)}
        style={
          rowHeight != null
            ? ({ "--dg-row-height": `${rowHeight}px` } as CSSProperties)
            : undefined
        }
      >
        {(enableColumnChooser || toolbarLeft) && (
          <div className={rootStyles.toolbar}>
            {toolbarLeft && (
              <div className={rootStyles.toolbarLeft}>{toolbarLeft}</div>
            )}
            {enableColumnChooser && <ColumnChooser table={table} />}
          </div>
        )}

        {/* 3 viewport kiểu AG Grid: header/footer cố định (overflow hidden),
            body là viewport cuộn duy nhất — thanh cuộn nằm TRONG vùng dữ liệu */}
        <div className={rootStyles.gridViewport}>
          <div className={rootStyles.headerBar}>
            <div ref={headerViewportRef} className={rootStyles.headerViewport}>
              <table
                className={rootStyles.table}
                style={{ width: table.getTotalSize() }}
              >
                <HeaderRow<T> />
              </table>
            </div>
            <div
              className={classNames(
                rootStyles.viewportSpacer,
                rootStyles.viewportSpacerHeader,
              )}
            />
          </div>

          {/* tabIndex=0: sẵn cho keyboard navigation kiểu Excel (v2) */}
          <div
            ref={scrollRef}
            className={classNames(rootStyles.scrollArea, {
              [rootStyles.scrollAreaFixed]: height != null,
            })}
            tabIndex={0}
            style={height != null ? { height } : undefined}
            onScroll={handleBodyScroll}
          >
            <table
              className={classNames(rootStyles.table, {
                [overlayStyles.fetching]: isFetching && !isLoading,
              })}
              style={{ width: table.getTotalSize() }}
            >
              <BodyRows<T> />
            </table>
            {showEmpty && <EmptyState message={emptyMessage} />}
            {isLoading && <LoadingOverlay />}
          </div>

          {hasFooter && rows.length > 0 && (
            <div className={rootStyles.footerBar}>
              <div ref={footerViewportRef} className={rootStyles.footerViewport}>
                <table
                  className={rootStyles.table}
                  style={{ width: table.getTotalSize() }}
                >
                  <FooterRow<T> />
                </table>
              </div>
              <div className={rootStyles.viewportSpacer} />
            </div>
          )}
        </div>

        <Pager table={table} pageSizeOptions={pageSizeOptions} />
      </div>
    </GridContextProvider>
  );
};

export default DataGrid;
