import type { CSSProperties } from "react";
import type { Column } from "@tanstack/react-table";

/**
 * Style sticky cho ô thuộc cột ghim.
 * getStart/getAfter đã tính theo columnSizing hiện hành → resize tự cập nhật offset.
 * Background KHÔNG set ở đây — set qua class CSS trên td/th (tr sticky trong suốt sẽ lộ nội dung).
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
