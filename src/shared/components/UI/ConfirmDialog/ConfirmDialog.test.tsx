import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import ConfirmDialogHost from "./ConfirmDialogHost";
import { customConfirm } from "./ConfirmDialog";
import { resetConfirmQueue } from "./confirmStore";

// Modal render qua portal vào #modal, phải tự dựng nút này trong jsdom
beforeEach(() => {
  const root = document.createElement("div");
  root.id = "modal";
  document.body.appendChild(root);
});

afterEach(() => {
  resetConfirmQueue();
  document.getElementById("modal")?.remove();
  document.body.style.overflow = "";
});

const open = async (params: Parameters<typeof customConfirm>[0]) => {
  let answer!: Promise<boolean>;
  await act(async () => {
    answer = customConfirm(params);
  });
  // Bọc trong object: trả thẳng promise thì `await open(...)` sẽ unwrap nó
  // và test đứng chờ người dùng trả lời
  return { answer };
};

describe("customConfirm", () => {
  it("chưa gọi thì host không render gì", () => {
    const { baseElement } = render(<ConfirmDialogHost />);

    expect(baseElement.querySelector("dialog")).toBeNull();
  });

  it("bấm Đồng ý thì promise trả true", async () => {
    render(<ConfirmDialogHost />);
    const { answer } = await open({ title: "Xoá ảnh", text: "Xoá ảnh này?" });

    await act(async () => {
      fireEvent.click(screen.getByText("Đồng ý"));
    });

    await expect(answer).resolves.toBe(true);
  });

  it("bấm Bỏ qua thì promise trả false", async () => {
    render(<ConfirmDialogHost />);
    const { answer } = await open({ text: "Chắc chưa?" });

    await act(async () => {
      fireEvent.click(screen.getByText("Bỏ qua"));
    });

    await expect(answer).resolves.toBe(false);
  });

  it("nhấn Escape thì coi như trả lời không", async () => {
    render(<ConfirmDialogHost />);
    const { answer } = await open({ text: "Chắc chưa?" });

    await act(async () => {
      fireEvent.keyDown(document, { key: "Escape" });
    });

    await expect(answer).resolves.toBe(false);
    // Hộp thoại biến mất sau khi chạy xong animation đóng
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("đổi được chữ trên hai nút", async () => {
    render(<ConfirmDialogHost />);
    await open({
      text: "Chắc chưa?",
      options: { trueButtonText: "Xoá luôn", falseButtonText: "Thôi" },
    });

    expect(screen.getByText("Xoá luôn")).toBeInTheDocument();
    expect(screen.getByText("Thôi")).toBeInTheDocument();
  });

  it("danger đổi nút đồng ý sang màu cảnh báo", async () => {
    render(<ConfirmDialogHost />);
    await open({ text: "Xoá vĩnh viễn?", danger: true });

    expect(screen.getByText("Đồng ý").closest("button")).toHaveAttribute(
      "data-variant",
      "error",
    );
  });

  it("mặc định nút đồng ý là màu primary", async () => {
    render(<ConfirmDialogHost />);
    await open({ text: "Chắc chưa?" });

    // Từ bản design system navy: hành động chính dùng primary, không dùng
    // success — xanh lá để dành cho trạng thái "đã xong", không phải nút bấm.
    expect(screen.getByText("Đồng ý").closest("button")).toHaveAttribute(
      "data-variant",
      "primary",
    );
  });

  it("hai lời gọi liên tiếp thì xếp hàng, không chồng lên nhau", async () => {
    render(<ConfirmDialogHost />);
    const { answer: first } = await open({ text: "Câu hỏi 1" });
    const { answer: second } = await open({ text: "Câu hỏi 2" });

    // chỉ câu hỏi đầu hiện ra
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.getByText("Câu hỏi 1")).toBeInTheDocument();
    expect(screen.queryByText("Câu hỏi 2")).toBeNull();

    await act(async () => {
      fireEvent.click(screen.getByText("Đồng ý"));
    });
    await expect(first).resolves.toBe(true);

    // trả lời xong thì câu thứ hai mới tới lượt
    expect(await screen.findByText("Câu hỏi 2")).toBeInTheDocument();
    expect(screen.getAllByRole("dialog")).toHaveLength(1);

    await act(async () => {
      fireEvent.click(screen.getByText("Bỏ qua"));
    });
    await expect(second).resolves.toBe(false);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("nối tiêu đề vào dialog qua aria-labelledby", async () => {
    render(<ConfirmDialogHost />);
    await open({ title: "Xoá ảnh", text: "Xoá ảnh này?" });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute(
      "aria-labelledby",
      screen.getByText("Xoá ảnh").id,
    );
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("khoá scroll nền trong lúc hộp thoại mở", async () => {
    render(<ConfirmDialogHost />);
    await open({ text: "Chắc chưa?" });

    expect(document.body.style.overflow).toBe("hidden");

    await act(async () => {
      fireEvent.click(screen.getByText("Bỏ qua"));
    });

    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });
});
