import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import ModalContent from "./ModalContent";

// Modal render qua portal vào #modal, phải tự dựng nút này trong jsdom
beforeEach(() => {
  const root = document.createElement("div");
  root.id = "modal";
  document.body.appendChild(root);
});

afterEach(() => {
  document.getElementById("modal")?.remove();
  document.body.style.overflow = "";
});

const renderModal = (props: Partial<Parameters<typeof Modal>[0]> = {}) => {
  const onClose = vi.fn();
  const view = render(
    <Modal onClose={onClose} {...props}>
      <ModalHeader title="Tiêu đề" />
      <ModalContent>
        <input aria-label="Ô nhập" />
      </ModalContent>
    </Modal>,
  );
  return { onClose, ...view };
};

describe("Modal", () => {
  it("nối tiêu đề vào dialog qua aria-labelledby", () => {
    renderModal();

    const dialog = screen.getByRole("dialog");
    const title = screen.getByText("Tiêu đề");

    expect(title.id).not.toBe("");
    expect(dialog).toHaveAttribute("aria-labelledby", title.id);
  });

  it("bấm nút đóng thì gọi onClose", () => {
    const { onClose } = renderModal();

    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe("phím Escape", () => {
    it("không đóng khi closeOnEscape tắt (mặc định)", () => {
      const { onClose } = renderModal();

      fireEvent.keyDown(document, { key: "Escape" });

      expect(onClose).not.toHaveBeenCalled();
    });

    it("đóng khi closeOnEscape bật, kể cả lúc focus chưa nằm trong modal", () => {
      const { onClose } = renderModal({ closeOnEscape: true });
      (document.activeElement as HTMLElement | null)?.blur();

      fireEvent.keyDown(document, { key: "Escape" });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("bấm ra nền", () => {
    it("không đóng khi closeOnBackdrop tắt (mặc định)", () => {
      const { onClose, baseElement } = renderModal();

      fireEvent.click(baseElement.querySelector("[class*=backdrop]")!);

      expect(onClose).not.toHaveBeenCalled();
    });

    it("đóng khi closeOnBackdrop bật", () => {
      const { onClose, baseElement } = renderModal({ closeOnBackdrop: true });

      fireEvent.click(baseElement.querySelector("[class*=backdrop]")!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("không đóng khi cú bấm xuất phát từ trong modal", () => {
      const { onClose } = renderModal({ closeOnBackdrop: true });

      fireEvent.click(screen.getByRole("dialog"));

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("focus", () => {
    it("đưa focus vào dialog khi mở", () => {
      renderModal();

      expect(document.activeElement).toBe(screen.getByRole("dialog"));
    });

    it("trả focus về chỗ cũ khi đóng", () => {
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);
      trigger.focus();

      const { unmount } = renderModal();
      expect(document.activeElement).not.toBe(trigger);

      unmount();

      expect(document.activeElement).toBe(trigger);
      trigger.remove();
    });

    it("Tab từ phần tử cuối vòng về phần tử đầu", () => {
      renderModal();
      const closeBtn = screen.getByRole("button", { name: "Đóng" });
      const input = screen.getByLabelText("Ô nhập");

      input.focus();
      fireEvent.keyDown(document, { key: "Tab" });

      expect(document.activeElement).toBe(closeBtn);
    });

    it("Shift+Tab từ phần tử đầu vòng về phần tử cuối", () => {
      renderModal();
      const closeBtn = screen.getByRole("button", { name: "Đóng" });
      const input = screen.getByLabelText("Ô nhập");

      closeBtn.focus();
      fireEvent.keyDown(document, { key: "Tab", shiftKey: true });

      expect(document.activeElement).toBe(input);
    });

    it("kéo focus về modal khi Tab lúc focus đang ở ngoài", () => {
      renderModal();
      const closeBtn = screen.getByRole("button", { name: "Đóng" });
      (document.activeElement as HTMLElement).blur();

      fireEvent.keyDown(document, { key: "Tab" });

      expect(document.activeElement).toBe(closeBtn);
    });
  });

  describe("nhiều modal chồng nhau", () => {
    it("chỉ modal trên cùng nhận Escape", () => {
      const duoi = renderModal({ closeOnEscape: true });
      const tren = renderModal({ closeOnEscape: true });

      fireEvent.keyDown(document, { key: "Escape" });

      expect(tren.onClose).toHaveBeenCalledTimes(1);
      expect(duoi.onClose).not.toHaveBeenCalled();
    });

    it("modal dưới nhận lại phím sau khi modal trên đóng", () => {
      const duoi = renderModal({ closeOnEscape: true });
      const tren = renderModal({ closeOnEscape: true });

      tren.unmount();
      fireEvent.keyDown(document, { key: "Escape" });

      expect(duoi.onClose).toHaveBeenCalledTimes(1);
    });

    it("Tab vòng trong modal trên cùng, không nhảy sang modal dưới", () => {
      renderModal();
      const tren = renderModal();
      const nutDongTren = tren.getAllByRole("button", { name: "Đóng" }).at(-1)!;
      const oNhapTren = tren.getAllByLabelText("Ô nhập").at(-1)!;

      // đang ở phần tử cuối của modal trên
      oNhapTren.focus();
      fireEvent.keyDown(document, { key: "Tab" });

      expect(document.activeElement).toBe(nutDongTren);
    });
  });

  describe("khoá scroll nền", () => {
    it("khoá lúc mở và trả lại lúc đóng", () => {
      const { unmount } = renderModal();

      expect(document.body.style.overflow).toBe("hidden");

      unmount();

      expect(document.body.style.overflow).toBe("");
    });

    it("chỉ mở khoá khi modal cuối cùng đóng", () => {
      const first = renderModal();
      const second = renderModal();

      first.unmount();
      expect(document.body.style.overflow).toBe("hidden");

      second.unmount();
      expect(document.body.style.overflow).toBe("");
    });
  });
});
