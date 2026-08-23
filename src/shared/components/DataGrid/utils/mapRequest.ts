import type { DyanmicDataPagingRequest } from "@shared/types/dynamic";
import { OPERATORS } from "../core/constants";
import type { ColumnDef } from "../types/column";
import type { GridFilterState, ServerGridState } from "../types/props";
import { camelToSnake } from "./caseConvert";

export type MapRequestOptions = {
  tableNames: string;
  fields?: string;
  searchFields?: string;
  /** Filter cố định merge thêm vào filter của grid */
  staticFilters?: GridFilterState[];
  /** Map field FE → tên cột thật của view (ưu tiên hơn camelToSnake) */
  serverFields?: Record<string, string>;
};

/** Gom serverField khai báo trong columns thành map cho useServerGrid */
export const buildServerFieldMap = <T,>(
  columns: ColumnDef<T>[],
): Record<string, string> =>
  Object.fromEntries(
    columns
      .filter((c) => c.serverField)
      .map((c) => [c.field, c.serverField as string]),
  );

/** Escape ký tự wildcard của LIKE/ILIKE để tìm đúng chuỗi người dùng gõ ("50%", "a_b") */
const escapeLike = (value: string) => value.replace(/[\\%_]/g, (c) => `\\${c}`);

/** ServerGridState → body của POST /dynamic/get-data */
export const mapRequest = (
  opts: MapRequestOptions,
  state: ServerGridState,
): DyanmicDataPagingRequest => {
  const toServerField = (field: string) =>
    opts.serverFields?.[field] ?? camelToSnake(field);

  const allFilters = [...(opts.staticFilters ?? []), ...state.filters];

  return {
    tableNames: opts.tableNames,
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    fields: opts.fields,
    searchFields: opts.searchFields,
    sorts: state.sorts.length
      ? state.sorts.map((s) => ({
          name: toServerField(s.field),
          direction: s.direction,
        }))
      : undefined,
    filters: allFilters.length
      ? allFilters.map((f) => ({
          field: toServerField(f.field),
          operator: OPERATORS[f.operator] ?? f.operator,
          // contains → ILIKE: escape wildcard rồi bọc %...% — người dùng không phải biết cú pháp SQL
          value: f.operator === "contains" ? `%${escapeLike(f.value)}%` : f.value,
        }))
      : undefined,
  };
};
