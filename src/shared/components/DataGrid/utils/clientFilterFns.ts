import type { FilterFn } from "@tanstack/react-table";

/** Giá trị filter mà floating filter đẩy vào columnFilters (client mode) */
export type ClientFilterValue = { operator: string; value: string };

/**
 * FilterFn dùng chung cho client mode — cùng ngôn ngữ operator với server
 * (contains / eq / gt / lt) để MỘT UI filter chạy cả hai chế độ.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gridClientFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  const { operator, value } = (filterValue ?? {}) as ClientFilterValue;
  if (!value) return true;
  const raw = row.getValue(columnId);
  if (raw == null) return false;

  switch (operator) {
    case "contains":
      return String(raw).toLowerCase().includes(value.toLowerCase());
    case "eq":
      return Number(raw) === Number(value);
    case "gt":
      return Number(raw) > Number(value);
    case "lt":
      return Number(raw) < Number(value);
    default:
      return true;
  }
};
