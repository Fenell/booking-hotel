/** Các lựa chọn cỡ trang mặc định */
export const DEFAULT_PAGE_SIZES = [20, 50, 100];
/** Debounce cho ô lọc (ms) */
export const FILTER_DEBOUNCE_MS = 400;
/** Debounce khi lưu cấu hình cột vào localStorage (ms) */
export const PERSIST_DEBOUNCE_MS = 500;
export const DEFAULT_COL_WIDTH = 150;
export const DEFAULT_MIN_WIDTH = 60;
/** Id cột checkbox chọn dòng */
export const SELECT_COL_ID = "__select__";
/** Độ rộng cột checkbox */
export const SELECT_COL_WIDTH = 44;
/** Tiền tố key localStorage */
export const PERSIST_PREFIX = "grid:";

/**
 * Map toán tử FE → chuỗi mà build_where_clause trong Postgres chấp nhận
 * (đã kiểm chứng 2026-08-23: =, >, <, >=, <=, LIKE, ILIKE — chuỗi lạ fallback về "=";
 * ILIKE được thêm bởi BE/db/2026-08-23_them-ilike-vao-build-where-clause.sql).
 * contains dùng ILIKE (không phân biệt hoa/thường) + value được bọc %...% ở mapRequest.
 */
export const OPERATORS: Record<string, string> = {
  contains: "ILIKE",
  eq: "=",
  gt: ">",
  lt: "<",
};

/** Nhãn hiển thị của toán tử số trên UI */
export const NUMBER_OPERATOR_LABELS: Record<string, string> = {
  eq: "=",
  gt: ">",
  lt: "<",
};
