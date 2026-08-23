import type { MouseEvent, ReactNode, Ref } from "react";
import type { ColumnDef } from "./column";
import type { DataGridRef } from "./ref";

/** Trạng thái sort gửi server */
export type GridSortState = { field: string; direction: "asc" | "desc" };
/** Trạng thái một filter gửi server */
export type GridFilterState = { field: string; operator: string; value: string };

/** Toàn bộ trạng thái server-side của grid — ngôn ngữ chung với BE */
export type ServerGridState = {
  /** 1-based, khớp pageNumber của endpoint dynamic */
  pageNumber: number;
  pageSize: number;
  sorts: GridSortState[];
  filters: GridFilterState[];
};

export type DataGridProps<T> = {
  /** Không truyền → tự sinh cột từ record đầu tiên của data (map động) */
  columns?: ColumnDef<T>[];
  /** Chỉnh đè từng cột theo field — dùng được cả với cột khai báo tay lẫn cột auto-sinh */
  columnOverrides?: Record<string, Partial<ColumnDef<T>>>;
  /** Server mode: dữ liệu trang hiện tại. Client mode: TOÀN BỘ dataSource */
  data: T[];
  getRowId: (row: T) => string;
  /** Có gridKey ⇒ tự lưu/khôi phục cấu hình cột vào localStorage "grid:<gridKey>" */
  gridKey?: string;

  /** Mặc định: true nếu có onStateChange, ngược lại false (client-side) */
  serverSide?: boolean;
  /** Tổng số bản ghi (server mode) — Number(res.total) */
  rowCount?: number;
  state?: ServerGridState;
  onStateChange?: (next: ServerGridState) => void;

  /** Lần fetch đầu — hiện overlay che body */
  isLoading?: boolean;
  /** Refetch giữ dữ liệu cũ — làm mờ nhẹ body */
  isFetching?: boolean;
  pageSizeOptions?: number[];

  enableSelection?: boolean;
  /** Controlled selection (tùy chọn) — key theo getRowId */
  selectedRowIds?: Record<string, boolean>;
  onSelectionChange?: (ids: Record<string, boolean>) => void;

  /** Dòng tổng pinned bottom — key theo field, ưu tiên hơn ColumnDef.aggregate */
  footerData?: Partial<Record<string, number | string>>;
  /** Nhãn hiện ở cột đầu tiên của dòng tổng, vd "Tổng" */
  footerLabel?: string;

  enableResize?: boolean;
  enableSort?: boolean;
  enableFilter?: boolean;
  enableColumnChooser?: boolean;
  enablePinning?: boolean;
  /**
   * Hover vào ô/tiêu đề bị cắt (…) thì hiện tooltip nội dung đầy đủ.
   * Mặc định true — tắt riêng từng cột bằng `ColumnDef.tooltip = false`.
   */
  enableTooltip?: boolean;
  /** Trễ trước khi tooltip xuất hiện (ms), mặc định 300 */
  tooltipDelay?: number;

  /** Chiều cao vùng cuộn body; mặc định "auto" */
  height?: number | string;
  emptyMessage?: string;
  className?: string;

  // ===== Row props =====
  onRowClick?: (row: T, e: MouseEvent<HTMLTableRowElement>) => void;
  onRowDoubleClick?: (row: T, e: MouseEvent<HTMLTableRowElement>) => void;
  /** Tô class cho dòng theo điều kiện (class do NGƯỜI DÙNG tự định nghĩa ngoài grid) */
  rowClassName?: (row: T) => string | undefined;
  /** Override chiều cao dòng (px) cho instance này */
  rowHeight?: number;

  /** Thanh công cụ tùy biến đặt cạnh ColumnChooser (vd nút hành động riêng) */
  toolbarLeft?: ReactNode;

  /** React 19: ref là prop thường — API mệnh lệnh của grid */
  ref?: Ref<DataGridRef<T>>;
};
