/** Đọc giá trị theo dot-path, vd getNestedValue(row, "roomType.typeName") */
export const getNestedValue = (obj: unknown, path: string): unknown => {
  if (obj == null) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
};
