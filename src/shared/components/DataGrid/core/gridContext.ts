import { createContext, useContext } from "react";
import type { MouseEvent } from "react";
import type { Table } from "@tanstack/react-table";
import type { ColumnDef } from "../types/column";
import type { GridFilterState } from "../types/props";

/**
 * Context nội bộ — điểm mở rộng state cho v2
 * (focusedCell / editingCell / draftChanges sẽ thêm vào đây).
 */
export type GridContextValue<T> = {
  table: Table<T>;
  serverSide: boolean;
  enableSort: boolean;
  enableFilter: boolean;
  enableResize: boolean;
  enableSelection: boolean;
  /** Có ít nhất 1 cột khai báo filter → mới render hàng floating filter */
  hasFilterRow: boolean;
  /** Giá trị hiện tại của các ô lọc — nguồn sự thật cho UI filter cả 2 chế độ */
  filterState: Record<string, GridFilterState>;
  /** Đặt/gỡ filter một cột (value rỗng = gỡ) — debounce do component filter tự lo */
  setFilter: (field: string, operator: string, value: string) => void;
  colDefFor: (columnId: string) => ColumnDef<T> | undefined;
  emptyMessage: string;
  footerData?: Partial<Record<string, number | string>>;
  footerLabel?: string;
  hasFooter: boolean;
  data: T[];
  onRowClick?: (row: T, e: MouseEvent<HTMLTableRowElement>) => void;
  onRowDoubleClick?: (row: T, e: MouseEvent<HTMLTableRowElement>) => void;
  rowClassName?: (row: T) => string | undefined;
  getRowId: (row: T) => string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GridContext = createContext<GridContextValue<any> | null>(null);

export const GridContextProvider = GridContext.Provider;

export const useGridContext = <T,>(): GridContextValue<T> => {
  const ctx = useContext(GridContext);
  if (!ctx) throw new Error("useGridContext phải dùng bên trong DataGrid");
  return ctx as GridContextValue<T>;
};
