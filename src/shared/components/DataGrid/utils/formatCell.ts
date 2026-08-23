import type { ColumnDef } from "../types/column";
import { getNestedValue } from "./getNestedValue";

/**
 * Format số N0 kiểu vi-VN. KHÔNG dùng formatNumber của repo vì hàm đó
 * check falsy (`if (!value)`) làm giá trị 0 hiển thị chuỗi rỗng.
 */
export const formatN0 = (value: number): string => value.toLocaleString("vi-VN");

/**
 * Điểm đọc giá trị hiển thị DUY NHẤT của mọi ô không có cell template.
 * (v2 sẽ chèn draft overlay của batch edit vào đây — không đọc raw value chỗ khác.)
 */
export const formatCell = <T,>(row: T, colDef: ColumnDef<T>): string => {
  const value = getNestedValue(row, colDef.field);
  if (value == null) return "";
  if (colDef.format === "N0" && typeof value === "number") {
    return formatN0(value);
  }
  if (value instanceof Date) return value.toLocaleDateString("vi-VN");
  if (typeof value === "object") return "";
  return String(value);
};
