/** Nơi duy nhất khai báo cache key của feature Loại phòng. */
export const roomTypeKeys = {
  /** Gốc — invalidate key này làm mới mọi dữ liệu loại phòng */
  all: ["roomTypes"] as const,
  /** Danh sách rút gọn để feature khác chọn loại phòng */
  options: () => [...roomTypeKeys.all, "options"] as const,
};
