/**
 * Màu mặc định của biểu tượng khi bản ghi chưa có `color`.
 *
 * Đây là **màu dữ liệu** (người dùng tự chọn cho từng icon), không phải màu
 * giao diện — nên cố ý KHÔNG lấy từ design token. Nhưng phải có một giá trị
 * duy nhất: trước đây ba nơi dùng ba màu khác nhau (#2796fd, #21a9e4, #5fb2ed)
 * nên cùng một icon hiện ra ba sắc xanh tuỳ màn hình. Giá trị này khớp với
 * toàn bộ icon đang có trong DB.
 */
export const DEFAULT_ICON_COLOR = "#21a9e4";
