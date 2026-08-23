import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCellTooltip } from "./useCellTooltip";

/** Ô giả có sẵn toạ độ — jsdom luôn trả rect toàn số 0 */
const makeCell = (top: number, bottom: number) => {
  const el = document.createElement("div");
  document.body.appendChild(el);
  el.getBoundingClientRect = () =>
    ({
      top,
      bottom,
      left: 100,
      right: 300,
      width: 200,
      height: bottom - top,
      x: 100,
      y: top,
      toJSON: () => ({}),
    }) as DOMRect;
  return el;
};

describe("useCellTooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("chỉ hiện sau đúng khoảng delay", () => {
    const { result } = renderHook(() => useCellTooltip(true, 300));
    const el = makeCell(200, 240);

    act(() => result.current.show(el, "Nội dung dài"));
    act(() => void vi.advanceTimersByTime(299));
    expect(result.current.data).toBeNull();

    act(() => void vi.advanceTimersByTime(1));
    expect(result.current.data?.content).toBe("Nội dung dài");
  });

  it("đặt tooltip phía trên, canh giữa ô", () => {
    const { result } = renderHook(() => useCellTooltip(true, 300));
    const el = makeCell(200, 240);

    act(() => result.current.show(el, "abc"));
    act(() => void vi.advanceTimersByTime(300));

    // tâm ngang = left + width/2 = 200; y = top - GAP(6)
    expect(result.current.data).toMatchObject({
      x: 200,
      y: 194,
      placement: "top",
    });
  });

  it("lật xuống dưới khi ô sát mép trên màn hình", () => {
    const { result } = renderHook(() => useCellTooltip(true, 300));
    const el = makeCell(10, 50);

    act(() => result.current.show(el, "abc"));
    act(() => void vi.advanceTimersByTime(300));

    // y = bottom + GAP(6)
    expect(result.current.data).toMatchObject({ y: 56, placement: "bottom" });
  });

  it("rời chuột trước khi hết giờ thì không hiện", () => {
    const { result } = renderHook(() => useCellTooltip(true, 300));
    const el = makeCell(200, 240);

    act(() => result.current.show(el, "abc"));
    act(() => result.current.hide());
    act(() => void vi.advanceTimersByTime(1000));

    expect(result.current.data).toBeNull();
  });

  it("ô bị gỡ khỏi DOM trong lúc chờ thì bỏ qua", () => {
    const { result } = renderHook(() => useCellTooltip(true, 300));
    const el = makeCell(200, 240);

    act(() => result.current.show(el, "abc"));
    el.remove();
    act(() => void vi.advanceTimersByTime(300));

    expect(result.current.data).toBeNull();
  });

  it("không làm gì khi tắt tooltip hoặc nội dung rỗng", () => {
    const off = renderHook(() => useCellTooltip(false, 300));
    const el = makeCell(200, 240);
    act(() => off.result.current.show(el, "abc"));
    act(() => void vi.advanceTimersByTime(300));
    expect(off.result.current.data).toBeNull();

    const on = renderHook(() => useCellTooltip(true, 300));
    act(() => on.result.current.show(el, ""));
    act(() => void vi.advanceTimersByTime(300));
    expect(on.result.current.data).toBeNull();
  });

  it("cuộn trang thì ẩn tooltip đang hiện", () => {
    const { result } = renderHook(() => useCellTooltip(true, 300));
    const el = makeCell(200, 240);

    act(() => result.current.show(el, "abc"));
    act(() => void vi.advanceTimersByTime(300));
    expect(result.current.data).not.toBeNull();

    act(() => void window.dispatchEvent(new Event("scroll")));
    expect(result.current.data).toBeNull();
  });
});
