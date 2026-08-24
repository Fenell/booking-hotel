/**
 * Cửa trước của feature Cơ sở cho thuê — feature khác CHỈ được import từ đây,
 * không import sâu vào ./api, ./hook hay ./types.
 */
export { usePropertyOptions } from "./hook/usePropertyOptions";
export type { PropertyOption } from "./types/property.type";
export { RENTAL_TYPE, RENTAL_TYPE_LABEL } from "./types/property.type";
