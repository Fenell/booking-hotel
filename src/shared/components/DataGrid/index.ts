// ===== Public API duy nhất của DataGrid =====
export { default as DataGrid } from "./DataGrid";
export { useServerGrid } from "./hooks/useServerGrid";
export { buildServerFieldMap } from "./utils/mapRequest";
export { inferColumns } from "./core/inferColumns";

export type {
  ColumnAlign,
  ColumnDef,
  ColumnFilterConfig,
  ColumnFormat,
  ColumnPin,
  DataGridProps,
  DataGridRef,
  GridFilterState,
  GridSortState,
  NumberOperator,
  PersistedColumnState,
  PersistedGridConfigV1,
  RowNode,
  ServerGridState,
} from "./types";
export type {
  ServerPage,
  UseServerGridOptions,
  UseServerGridResult,
} from "./hooks/useServerGrid";
