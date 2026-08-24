/** Nơi duy nhất khai báo cache key của feature Cơ sở cho thuê. */
export const propertyKeys = {
  /** Gốc — invalidate key này làm mới mọi dữ liệu cơ sở */
  all: ["properties"] as const,
  /** Danh sách rút gọn để feature khác chọn cơ sở */
  options: () => [...propertyKeys.all, "options"] as const,
};
