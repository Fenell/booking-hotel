import { PERSIST_PREFIX } from "../core/constants";
import type { ColumnDef } from "../types/column";
import type {
  PersistedColumnState,
  PersistedGridConfigV1,
} from "../types/persist";

export const persistKey = (gridKey: string) => `${PERSIST_PREFIX}${gridKey}`;

/** Parse + validate cấu hình đã lưu; hỏng/không đúng version → null */
export const parsePersisted = (raw: string | null): PersistedGridConfigV1 | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PersistedGridConfigV1;
    if (parsed?.version !== 1 || !Array.isArray(parsed.columns)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export type InitialColumnState = {
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  columnSizing: Record<string, number>;
};

/**
 * Merge cấu hình đã lưu với columns hiện tại:
 * - field đã lưu nhưng không còn trong columns → bỏ;
 * - field mới chưa có trong bản lưu → nối cuối với giá trị mặc định.
 */
export const mergePersisted = <T,>(
  persisted: PersistedGridConfigV1 | null,
  colDefs: ColumnDef<T>[],
): InitialColumnState => {
  const defaults: InitialColumnState = {
    columnOrder: colDefs.map((c) => c.field),
    columnVisibility: Object.fromEntries(
      colDefs.map((c) => [c.field, c.visible ?? true]),
    ),
    columnSizing: {},
  };
  if (!persisted) return defaults;

  const known = new Set(colDefs.map((c) => c.field));
  const kept = persisted.columns.filter((c) => known.has(c.field));
  const keptFields = new Set(kept.map((c) => c.field));
  const appended = colDefs.filter((c) => !keptFields.has(c.field));

  const columnOrder = [...kept.map((c) => c.field), ...appended.map((c) => c.field)];
  const columnVisibility: Record<string, boolean> = {};
  const columnSizing: Record<string, number> = {};
  for (const c of kept) {
    columnVisibility[c.field] = c.visible;
    if (c.width != null) columnSizing[c.field] = c.width;
  }
  for (const c of appended) columnVisibility[c.field] = c.visible ?? true;

  return { columnOrder, columnVisibility, columnSizing };
};

/** Chuyển state runtime về schema lưu trữ */
export const toPersisted = (
  columnOrder: string[],
  columnVisibility: Record<string, boolean>,
  columnSizing: Record<string, number>,
): PersistedGridConfigV1 => ({
  version: 1,
  columns: columnOrder.map<PersistedColumnState>((field) => ({
    field,
    width: columnSizing[field],
    visible: columnVisibility[field] ?? true,
  })),
  updatedAt: new Date().toISOString(),
});

export const savePersisted = (gridKey: string, config: PersistedGridConfigV1) => {
  try {
    localStorage.setItem(persistKey(gridKey), JSON.stringify(config));
  } catch {
    // quota / private mode — bỏ qua, không làm vỡ grid
  }
};

export const removePersisted = (gridKey: string) => {
  try {
    localStorage.removeItem(persistKey(gridKey));
  } catch {
    // bỏ qua
  }
};

export const loadPersisted = (gridKey: string): PersistedGridConfigV1 | null => {
  try {
    return parsePersisted(localStorage.getItem(persistKey(gridKey)));
  } catch {
    return null;
  }
};
