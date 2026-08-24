import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PageSizeSelect from "./PageSizeSelect";

const renderSelect = (onChange = vi.fn()) => {
  render(<PageSizeSelect value={20} options={[20, 50, 100]} onChange={onChange} />);
  return { onChange, trigger: screen.getByRole("combobox") };
};

const openList = () => {
  fireEvent.click(screen.getByRole("combobox"));
  return screen.getByRole("listbox");
};

describe("PageSizeSelect", () => {
  it("nút hiện cỡ trang đang chọn và mặc định đóng danh sách", () => {
    const { trigger } = renderSelect();

    expect(trigger).toHaveTextContent("20");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("mở danh sách thì đủ option và đánh dấu đúng dòng đang chọn", () => {
    renderSelect();
    openList();

    const options = screen.getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["20", "50", "100"]);
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });

  it("chọn bằng chuột thì báo cỡ trang mới rồi đóng danh sách", () => {
    const { onChange } = renderSelect();
    openList();

    fireEvent.click(screen.getByRole("option", { name: "50" }));

    expect(onChange).toHaveBeenCalledWith(50);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("điều hướng và chọn được bằng bàn phím", () => {
    const { onChange, trigger } = renderSelect();

    // Mũi tên trên nút cũng mở danh sách, không chỉ click
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const list = screen.getByRole("listbox");

    fireEvent.keyDown(list, { key: "ArrowDown" });
    fireEvent.keyDown(list, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith(50);
  });

  it("mũi tên chạy vòng và Home/End nhảy về hai đầu", () => {
    const { onChange } = renderSelect();
    const list = openList();

    // đang ở option đầu (20) — lên một nấc là vòng xuống cuối danh sách
    fireEvent.keyDown(list, { key: "ArrowUp" });
    fireEvent.keyDown(list, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(100);

    const list2 = openList();
    fireEvent.keyDown(list2, { key: "End" });
    fireEvent.keyDown(list2, { key: "Home" });
    fireEvent.keyDown(list2, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(20);
  });

  it("Escape đóng danh sách, trả focus về nút và không đổi cỡ trang", () => {
    const { onChange, trigger } = renderSelect();
    const list = openList();

    fireEvent.keyDown(list, { key: "Escape" });

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(trigger).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("bấm ra ngoài thì đóng danh sách", () => {
    renderSelect();
    openList();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
