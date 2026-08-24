import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DataGrid from "./DataGrid";
import type { ColumnDef } from "./types/column";

type Room = { id: string; name: string; note: string; price: number };

const data: Room[] = [
  { id: "1", name: "P.101", note: "Ghi chú rất dài bị cắt", price: 1500000 },
  { id: "2", name: "P.102", note: "Ngắn", price: 900000 },
];

const columns: ColumnDef<Room>[] = [
  { field: "name", headerText: "Tên phòng" },
  { field: "note", headerText: "Ghi chú" },
  { field: "price", headerText: "Giá", format: "N0", align: "right" },
];

const renderGrid = (props: Partial<Parameters<typeof DataGrid<Room>>[0]> = {}) =>
  render(
    <DataGrid<Room>
      columns={columns}
      data={data}
      getRowId={(r) => r.id}
      {...props}
    />,
  );

describe("DataGrid (client-side)", () => {
  it("hiển thị tiêu đề cột và dữ liệu đã format", () => {
    renderGrid();

    expect(screen.getByText("Tên phòng")).toBeInTheDocument();
    expect(screen.getByText("P.101")).toBeInTheDocument();
    // format N0 kiểu vi-VN
    expect(screen.getByText("1.500.000")).toBeInTheDocument();
  });

  it("hiện thông báo rỗng khi không có dữ liệu", () => {
    renderGrid({ data: [], emptyMessage: "Chưa có phòng nào" });
    expect(screen.getByText("Chưa có phòng nào")).toBeInTheDocument();
  });

  it("đổi cỡ trang bằng combobox thì phân trang lại", async () => {
    const user = userEvent.setup();
    renderGrid({ pageSizeOptions: [1, 2] });

    // Cỡ trang mặc định là lựa chọn đầu tiên → mỗi trang 1 dòng
    const dataRows = () => screen.getAllByRole("row").slice(1); // bỏ hàng header
    expect(dataRows()).toHaveLength(1);
    expect(screen.getByText("1 đến 1 trong 2")).toBeInTheDocument();

    await user.click(screen.getByRole("combobox", { name: "Số dòng mỗi trang" }));
    await user.click(screen.getByRole("option", { name: "2" }));

    expect(dataRows()).toHaveLength(2);
    expect(screen.getByText("1 đến 2 trong 2")).toBeInTheDocument();
  });

  it("bấm tiêu đề thì đảo thứ tự dòng", async () => {
    const user = userEvent.setup();
    renderGrid();

    const cellText = () =>
      screen
        .getAllByRole("row")
        .slice(1) // bỏ hàng header
        .map((row) => within(row).getAllByRole("cell")[0].textContent);

    expect(cellText()).toEqual(["P.101", "P.102"]);

    await user.click(screen.getByText("Tên phòng"));
    expect(cellText()).toEqual(["P.101", "P.102"]); // asc

    await user.click(screen.getByText("Tên phòng"));
    expect(cellText()).toEqual(["P.102", "P.101"]); // desc
  });
});

describe("DataGrid — tooltip ô bị cắt", () => {
  /** jsdom không layout nên phải tự bịa scrollWidth/clientWidth */
  const fakeOverflow = (overflowing: boolean) => {
    Object.defineProperty(HTMLTableCellElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => (overflowing ? 400 : 100),
    });
    Object.defineProperty(HTMLTableCellElement.prototype, "clientWidth", {
      configurable: true,
      get: () => 100,
    });
  };

  /**
   * React tổng hợp onMouseEnter/Leave từ cặp mouseover/mouseout nên test dùng
   * fireEvent.mouseOver chứ không phải mouseEnter (mouseEnter không bubble,
   * React sẽ không thấy). user-event thì kẹt với fake timer.
   */
  const hover = (el: HTMLElement) => fireEvent.mouseOver(el);
  const unhover = (el: HTMLElement) => fireEvent.mouseOut(el);

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    // @ts-expect-error trả prototype về trạng thái ban đầu
    delete HTMLTableCellElement.prototype.scrollWidth;
    // @ts-expect-error trả prototype về trạng thái ban đầu
    delete HTMLTableCellElement.prototype.clientWidth;
  });

  it("hover ô bị cắt: im lặng 300ms rồi mới hiện đủ nội dung", () => {
    fakeOverflow(true);
    renderGrid();

    hover(screen.getByText("Ghi chú rất dài bị cắt"));
    act(() => void vi.advanceTimersByTime(299));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    act(() => void vi.advanceTimersByTime(1));
    expect(screen.getByRole("tooltip")).toHaveTextContent(
      "Ghi chú rất dài bị cắt",
    );
  });

  it("rời chuột thì tooltip biến mất", () => {
    fakeOverflow(true);
    renderGrid();

    const cell = screen.getByText("Ghi chú rất dài bị cắt");
    hover(cell);
    act(() => void vi.advanceTimersByTime(300));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    act(() => void unhover(cell));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("ô hiển thị vừa đủ thì không hiện gì", () => {
    fakeOverflow(false);
    renderGrid();

    hover(screen.getByText("Ngắn"));
    act(() => void vi.advanceTimersByTime(1000));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
