import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Tooltip from "./Tooltip";

const renderTooltip = (props: Partial<Parameters<typeof Tooltip>[0]> = {}) =>
  render(
    <Tooltip content="Chỉnh sửa" {...props}>
      <button>Nút</button>
    </Tooltip>,
  );

// React tổng hợp onMouseEnter/Leave từ mouseover/mouseout, nên test phải bắn
// đúng hai sự kiện gốc đó
const hoverVao = (el: HTMLElement) => fireEvent.mouseOver(el);
const hoverRa = (el: HTMLElement) => fireEvent.mouseOut(el);

describe("Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("chưa tương tác thì không có tooltip trong DOM", () => {
    renderTooltip();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("rê chuột vào thì chờ hết delay mới hiện", () => {
    renderTooltip({ delay: 300 });
    const nut = screen.getByRole("button");

    hoverVao(nut);
    act(() => vi.advanceTimersByTime(299));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Chỉnh sửa");
  });

  it("rê chuột ra trước khi hết delay thì không hiện", () => {
    renderTooltip({ delay: 300 });
    const nut = screen.getByRole("button");

    hoverVao(nut);
    act(() => vi.advanceTimersByTime(200));
    hoverRa(nut);
    act(() => vi.advanceTimersByTime(500));

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("focus bằng bàn phím thì hiện ngay, không chờ delay", () => {
    renderTooltip({ delay: 300 });

    fireEvent.focus(screen.getByRole("button"));

    expect(screen.getByRole("tooltip")).toHaveTextContent("Chỉnh sửa");
  });

  it("blur thì ẩn", () => {
    renderTooltip();
    const nut = screen.getByRole("button");

    fireEvent.focus(nut);
    fireEvent.blur(nut);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("render ra ngoài body chứ không nằm cạnh nút", () => {
    const { container } = renderTooltip();

    fireEvent.focus(screen.getByRole("button"));

    const tooltip = screen.getByRole("tooltip");
    expect(container).not.toContainElement(tooltip);
    expect(tooltip.parentElement).toBe(document.body);
  });

  it("cuộn trang thì ẩn tooltip đang hiện", () => {
    renderTooltip();

    fireEvent.focus(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.scroll(window);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("nhận id để phần tử con trỏ tới bằng aria-describedby", () => {
    render(
      <Tooltip content="Chỉnh sửa" id="tip-1">
        <button aria-describedby="tip-1">Nút</button>
      </Tooltip>,
    );

    fireEvent.focus(screen.getByRole("button"));

    expect(screen.getByRole("tooltip")).toHaveAttribute("id", "tip-1");
  });

  it("không có content thì không bọc thêm gì", () => {
    const { container } = render(
      <Tooltip>
        <button>Nút</button>
      </Tooltip>,
    );

    expect(container.firstElementChild?.tagName).toBe("BUTTON");
  });

  it("dọn hẹn giờ khi bị gỡ khỏi cây, không hiện tooltip mồ côi", () => {
    const { unmount } = renderTooltip({ delay: 300 });

    hoverVao(screen.getByRole("button"));
    unmount();
    act(() => vi.advanceTimersByTime(500));

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
