/** camelCase → snake_case, giữ nguyên dot-path từng đoạn: "roomType.typeName" → "room_type.type_name" */
export const camelToSnake = (input: string): string =>
  input
    .split(".")
    .map((seg) => seg.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`))
    .join(".");
