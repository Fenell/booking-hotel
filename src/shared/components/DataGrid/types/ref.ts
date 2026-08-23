import type { PersistedColumnState } from "./persist";

/** Node mỏng bọc một dòng — tạo on-demand, không cache */
export type RowNode<T> = {
  id: string;
  data: T;
  /** Index trong danh sách đang hiển thị (client mode: sau sort + filter) */
  rowIndex: number;
  isSelected: () => boolean;
  setSelected: (selected: boolean) => void;
};

/**
 * API mệnh lệnh của DataGrid, truy cập qua ref.
 * Ở server mode, các API sort/filter/paging phát qua onStateChange
 * (không tự ý đổi dữ liệu — grid không sở hữu data).
 */
export type DataGridRef<T> = {
  // ===== Selection =====
  /** TOÀN BỘ id đã chọn — kể cả dòng thuộc trang khác (server mode) */
  getSelectedRowIds: () => string[];
  /** CHỈ các dòng đã chọn đang có trong `data` hiện tại (trang hiện tại ở server mode) — dùng getSelectedRowIds nếu cần danh sách đầy đủ */
  getSelectedRows: () => T[];
  setRowSelected: (id: string, selected: boolean) => void;
  selectAllCurrentPage: () => void;
  deselectAll: () => void;

  // ===== Cột =====
  setColumnVisible: (field: string, visible: boolean) => void;
  showColumns: (fields: string[]) => void;
  hideColumns: (fields: string[]) => void;
  pinColumn: (field: string, pin: "left" | "right" | null) => void;
  setColumnWidth: (field: string, width: number) => void;
  getColumnState: () => PersistedColumnState[];
  applyColumnState: (state: PersistedColumnState[]) => void;
  /** Về default từ columns prop + xóa localStorage "grid:<key>" */
  resetColumns: () => void;

  // ===== Sort / Filter / Paging =====
  setSort: (field: string, direction: "asc" | "desc" | null) => void;
  setFilter: (field: string, operator: string, value: string) => void;
  clearFilter: (field: string) => void;
  clearAllFilters: () => void;
  /** 1-based, tự clamp [1..totalPages] */
  goToPage: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
  getPageInfo: () => {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    rowCount: number;
  };

  // ===== Row =====
  getRowNode: (id: string) => RowNode<T> | undefined;
  getDisplayedRowNodes: () => RowNode<T>[];
  getRowElement: (id: string) => HTMLTableRowElement | null;
  scrollToRow: (id: string, align?: "top" | "center") => void;
  /** Nháy nền dòng ~1s (kiểu flash cells AG Grid) */
  flashRow: (id: string) => void;

  // ===== Tiện ích =====
  getRows: () => T[];
  getRow: (id: string) => T | undefined;
  /** Xuất CSV các dòng đang hiển thị, BOM UTF-8 cho Excel tiếng Việt */
  exportCsv: (opts?: { fileName?: string; visibleColumnsOnly?: boolean }) => void;
  scrollToTop: () => void;
};
