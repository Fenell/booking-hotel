/**
 * Nơi duy nhất khai báo cache key của feature Dịch vụ.
 *
 * Trước đây lưới dịch vụ và danh sách chọn dịch vụ (bên feature Phòng) cùng
 * dùng key ["services"] nhưng đọc từ hai nguồn khác nhau
 * (view_service_with_icon và bảng services), nên cache đè lên nhau tuỳ thứ tự
 * mở màn hình. Gom key về một chỗ để chuyện đó không lặp lại.
 *
 * Các key con đều bắt đầu bằng `all`, nên invalidate `all` sẽ làm mới tất cả.
 */
export const serviceKeys = {
  /** Gốc — invalidate key này làm mới mọi dữ liệu dịch vụ */
  all: ["services"] as const,
  /** Lưới danh sách dịch vụ (đọc từ view_service_with_icon) */
  grid: () => [...serviceKeys.all, "grid"] as const,
  /** Danh sách rút gọn để feature khác chọn dịch vụ (đọc từ bảng services) */
  options: () => [...serviceKeys.all, "options"] as const,
};
