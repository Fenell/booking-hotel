import type { ReactNode } from "react";

/** Căn lề nội dung ô */
export type ColumnAlign = "left" | "center" | "right";
/** Vị trí ghim cột */
export type ColumnPin = "left" | "right";
/** Định dạng hiển thị (v1 chỉ hỗ trợ số N0 kiểu vi-VN) */
export type ColumnFormat = "N0";
/** Toán tử lọc cho cột số */
export type NumberOperator = "eq" | "gt" | "lt";

/** Cấu hình ô lọc (floating filter) của một cột */
export type ColumnFilterConfig =
  | { type: "text" } // lọc contains
  | { type: "number"; operators?: NumberOperator[] }; // mặc định đủ =, >, <

/**
 * Khai báo một cột của DataGrid.
 * `field` là dot-path trên dữ liệu đã camelCase (vd "roomType.typeName"),
 * đồng thời là id định danh cột trong mọi state (visibility, sizing, order...).
 */
export type ColumnDef<T> = {
  field: string;
  headerText: string;
  /**
   * Tên cột thật (snake_case) gửi xuống BE khi sort/lọc server-side.
   * Không khai báo thì tự chuyển camelCase → snake_case
   * (lưu ý các ca lệch như createDate → created_date phải override).
   */
  serverField?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
  align?: ColumnAlign;
  format?: ColumnFormat;
  pinned?: ColumnPin;
  /** Mặc định true — đặt false cho cột template/hành động */
  sortable?: boolean;
  /** Mặc định true */
  resizable?: boolean;
  /** false/không khai báo = cột không có ô lọc */
  filter?: ColumnFilterConfig | false;
  /**
   * Hiện tooltip nội dung đầy đủ khi hover ô bị cắt (…).
   * Không khai báo → theo `enableTooltip` của grid; đặt false để tắt riêng cột
   * (vd cột nút hành động).
   */
  tooltip?: boolean;
  /** Cell template — nhận nguyên row, trả ReactNode */
  cell?: (row: T) => ReactNode;
  /**
   * Tính tổng client cho dòng footer — CHỈ dùng khi `footerData`
   * không có giá trị cho field này.
   */
  aggregate?: "sum" | "avg" | "count" | ((rows: T[]) => number);
};
