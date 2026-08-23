import type { ColumnDef as TanStackColumnDef } from "@tanstack/react-table";
import type { ColumnDef } from "../types/column";
import { gridClientFilterFn } from "../utils/clientFilterFns";
import { getNestedValue } from "../utils/getNestedValue";
import {
  DEFAULT_COL_WIDTH,
  DEFAULT_MIN_WIDTH,
  SELECT_COL_ID,
  SELECT_COL_WIDTH,
} from "./constants";

/**
 * Map ColumnDef của grid → ColumnDef của TanStack.
 * - LUÔN dùng accessorFn + id tường minh (accessorKey chứa "." bị TanStack coi là deep key và đổi id).
 * - Nguyên ColumnDef nằm trong meta.gridColDef — v2 thêm field mới không phải sửa file này.
 */
export const buildColumns = <T,>(
  colDefs: ColumnDef<T>[],
  enableSelection: boolean,
): TanStackColumnDef<T, unknown>[] => {
  const cols: TanStackColumnDef<T, unknown>[] = colDefs.map((col) => ({
    id: col.field,
    accessorFn: (row: T) => getNestedValue(row, col.field),
    size: col.width ?? DEFAULT_COL_WIDTH,
    minSize: col.minWidth ?? DEFAULT_MIN_WIDTH,
    maxSize: col.maxWidth,
    enableSorting: col.sortable ?? true,
    enableResizing: col.resizable ?? true,
    filterFn: gridClientFilterFn,
    meta: { gridColDef: col },
  }));

  if (enableSelection) {
    cols.unshift({
      id: SELECT_COL_ID,
      size: SELECT_COL_WIDTH,
      minSize: SELECT_COL_WIDTH,
      maxSize: SELECT_COL_WIDTH,
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
      meta: { isSelect: true },
    });
  }

  return cols;
};
