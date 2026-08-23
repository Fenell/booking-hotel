/** Nơi duy nhất khai báo cache key của feature Phòng. */
export const roomKeys = {
  /** Gốc — invalidate key này làm mới mọi dữ liệu phòng */
  all: ["rooms"] as const,
  /** Danh sách phòng đổ vào lưới */
  list: () => [...roomKeys.all, "list"] as const,
  /** Chi tiết một phòng (form sửa) */
  detail: (id?: string) => [...roomKeys.all, "detail", id] as const,
};
