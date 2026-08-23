import { describe, expect, it } from "vitest";
import type { Column } from "@tanstack/react-table";
import { getPinnedStyle } from "./pinning";

type Row = { id: string };

const fakeColumn = (
  pinned: "left" | "right" | false,
  { start = 0, after = 0 } = {},
) =>
  ({
    getIsPinned: () => pinned,
    getStart: () => start,
    getAfter: () => after,
  }) as unknown as Column<Row, unknown>;

describe("getPinnedStyle", () => {
  it("cột không ghim thì không sinh style nào", () => {
    expect(getPinnedStyle(fakeColumn(false))).toEqual({});
  });

  it("ghim trái dùng offset trái", () => {
    const style = getPinnedStyle(fakeColumn("left", { start: 120 }));
    expect(style.position).toBe("sticky");
    expect(style.left).toBe("120px");
    expect(style.right).toBeUndefined();
  });

  /**
   * Quan trọng: th (header, overflow hidden) và td (body, overflow-y scroll)
   * phải sinh RA CÙNG một giá trị `right` thì cột ghim mới thẳng hàng. Đừng bù
   * thêm bề rộng thanh cuộn cho body — Chrome đã neo vào scrollport khi có
   * thanh cuộn thật, bù nữa là lùi quá và hở khe lộ dữ liệu cột phía sau.
   */
  it("ghim phải dùng đúng offset phải, không cộng thêm gì", () => {
    const style = getPinnedStyle(fakeColumn("right", { after: 40 }));
    expect(style.right).toBe("40px");
    expect(style.left).toBeUndefined();
  });

  it("cột ghim phải ngoài cùng có offset 0", () => {
    expect(getPinnedStyle(fakeColumn("right")).right).toBe("0px");
  });
});
