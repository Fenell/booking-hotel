/**
 * Cửa trước của feature Dịch vụ — feature khác CHỈ được import từ đây,
 * không import sâu vào ./api, ./hook hay ./types.
 *
 * Cố ý không export ServiceResponse, ServiceCreateAndUpdateModel,
 * useServiceGrid... vì đó là chuyện nội bộ của màn hình Dịch vụ.
 */
export { useServiceOptions } from "./hook/useServiceOptions";
export type { ServiceOption } from "./types/service.type";
