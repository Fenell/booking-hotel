import type { ColumnDef } from "../types/column";

/** camelCase → "Camel Case" làm headerText mặc định */
const humanize = (field: string): string => {
  const spaced = field.replace(/([A-Z])/g, " $1").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T|$)/;

/**
 * Tự sinh cột từ record đầu tiên của dữ liệu (map động từ API):
 * - number  → căn phải + format N0 + filter số
 * - boolean → hiển thị Có/Không, có sort, không filter
 * - chuỗi ISO date → format ngày vi-VN
 * - field "id" → ẩn mặc định
 * - object/array lồng → bỏ qua (muốn hiện thì khai báo tay với dot-path)
 */
export const inferColumns = <T,>(
  data: T[],
  overrides?: Record<string, Partial<ColumnDef<T>>>,
): ColumnDef<T>[] => {
  const first = data[0];
  if (first == null || typeof first !== "object") return [];

  const cols: ColumnDef<T>[] = [];
  for (const [key, value] of Object.entries(first as Record<string, unknown>)) {
    if (value != null && typeof value === "object" && !(value instanceof Date)) {
      continue; // object/array lồng
    }

    const col: ColumnDef<T> = {
      field: key,
      headerText: humanize(key),
      visible: key !== "id",
    };

    if (typeof value === "number") {
      col.align = "right";
      col.format = "N0";
      col.filter = { type: "number" };
    } else if (typeof value === "boolean") {
      col.cell = (row) =>
        (row as Record<string, unknown>)[key] ? "Có" : "Không";
      col.align = "center";
    } else if (
      value instanceof Date ||
      (typeof value === "string" && ISO_DATE_RE.test(value))
    ) {
      col.cell = (row) => {
        const raw = (row as Record<string, unknown>)[key];
        if (raw == null || raw === "") return "";
        const d = raw instanceof Date ? raw : new Date(String(raw));
        return Number.isNaN(d.getTime()) ? String(raw) : d.toLocaleDateString("vi-VN");
      };
    } else if (typeof value === "string") {
      col.filter = { type: "text" };
    }

    cols.push(col);
  }

  return applyOverrides(cols, overrides);
};

/** Merge columnOverrides (key theo field) đè lên danh sách cột */
export const applyOverrides = <T,>(
  cols: ColumnDef<T>[],
  overrides?: Record<string, Partial<ColumnDef<T>>>,
): ColumnDef<T>[] => {
  if (!overrides) return cols;
  return cols.map((c) =>
    overrides[c.field] ? { ...c, ...overrides[c.field] } : c,
  );
};
