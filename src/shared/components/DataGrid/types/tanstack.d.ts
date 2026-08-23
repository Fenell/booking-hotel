// Mở rộng meta của TanStack để mang nguyên ColumnDef của grid —
// v2 thêm field mới vào ColumnDef là pipeline tự mang theo, không sửa buildColumns.
import type { ColumnDef } from "./column";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** ColumnDef gốc của grid (không có ở cột selection) */
    gridColDef?: ColumnDef<TData>;
    /** Cột checkbox chọn dòng */
    isSelect?: boolean;
  }
}
