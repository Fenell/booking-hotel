import type { CSSProperties } from "react";
import type { Column } from "@tanstack/react-table";

/**
 * Style sticky cho ô thuộc cột ghim.
 * getStart/getAfter đã tính theo columnSizing hiện hành → resize tự cập nhật offset.
 * Background KHÔNG set ở đây — set qua class CSS trên td/th (tr sticky trong suốt sẽ lộ nội dung).
 *
 * Dùng CHUNG cho th/td/tfoot và cố ý không bù gì thêm cho vùng cuộn: body để
 * `overflow-y: scroll` nên luôn có thanh cuộn dọc thật, mà khi có thanh cuộn
 * thật thì Chrome neo `right` vào scrollport (đã trừ thanh cuộn) — trùng đúng
 * mép phải của header viewport. Nếu ai đó đổi body về `overflow: auto` hoặc
 * `scrollbar-gutter: stable`, dải bên phải thành khoảng trống và Chrome quay
 * sang neo vào padding box → cột ghim ở header và body lệch nhau đúng bề rộng
 * thanh cuộn. Đừng đổi (xem README mục 11).
 */
export const getPinnedStyle = <T,>(column: Column<T, unknown>): CSSProperties => {
  const pinned = column.getIsPinned();
  if (!pinned) return {};
  return {
    position: "sticky",
    left: pinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: pinned === "right" ? `${column.getAfter("right")}px` : undefined,
  };
};

/** Thông tin để gắn class viền phân cách vùng ghim */
export const getPinnedEdge = <T,>(column: Column<T, unknown>) => {
  const pinned = column.getIsPinned();
  return {
    pinned,
    isLastLeft: pinned === "left" && column.getIsLastColumn("left"),
    isFirstRight: pinned === "right" && column.getIsFirstColumn("right"),
  };
};
