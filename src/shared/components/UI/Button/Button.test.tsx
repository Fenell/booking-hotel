import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
  it("mặc định là type=button để không lỡ submit form khi đặt trong <form>", () => {
    render(<Button status="default">Hủy bỏ</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("cho nơi gọi ghi đè type", () => {
    render(<Button type="submit">Cất giữ</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("isLoading khoá nút thật sự, không chỉ bằng CSS", async () => {
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Cất giữ
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("isLoading vẫn giữ nội dung trong DOM để nút không đổi bề rộng", () => {
    render(<Button isLoading>Cất giữ</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Cất giữ");
  });

  it("nút chỉ có icon lấy nội dung tooltip làm tên khả truy cập", () => {
    render(
      <Button
        status="error"
        icon="fa-regular fa-trash"
        showTooltip
        tooltipContent="Xóa dòng"
      />,
    );
    expect(screen.getByRole("button", { name: "Xóa dòng" })).toBeInTheDocument();
  });

  it("không đè aria-label mà nơi gọi đã tự đặt", () => {
    render(
      <Button
        icon="fa-regular fa-trash"
        showTooltip
        tooltipContent="Xóa dòng"
        aria-label="Xóa phòng 101"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Xóa phòng 101" }),
    ).toBeInTheDocument();
  });

  it("status mặc định là default", () => {
    render(<Button>Nút</Button>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "default",
    );
  });

  it("chuyển tiếp ref tới đúng phần tử button", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Nút</Button>);
    expect(ref.current).toBe(screen.getByRole("button"));
  });

  it("tooltip hiện khi nút nhận focus bằng bàn phím", async () => {
    render(
      <Button showTooltip tooltipContent="Xóa dòng" icon="fa-regular fa-trash" />,
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await userEvent.tab();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Xóa dòng");
  });
});
