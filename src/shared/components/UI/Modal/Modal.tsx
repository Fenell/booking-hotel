import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import modalStyle from "./Modal.module.css";
import { motion } from "motion/react";
import classNames from "classnames";
import { ModalContext } from "./ModalContext";

type ModalProps = {
  children: ReactNode;
  size?: "sm" | "xs" | "lg";
  onClose: () => void;
  /** Cho phép nhấn Escape để đóng. Mặc định tắt vì phần lớn modal đang là form nhập liệu. */
  closeOnEscape?: boolean;
  /** Cho phép bấm ra nền tối để đóng. Mặc định tắt, lý do như trên. */
  closeOnBackdrop?: boolean;
};

// Hằng số thuần, đặt ngoài component để không tạo lại mỗi lần render
const variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  hiddenBackDrop: { opacity: 0 },
  visibleBackDrop: { opacity: 1 },
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// Ngăn xếp modal đang mở: chỉ modal trên cùng mới được xử lý phím,
// nếu không thì modal nền cũng giành Tab/Escape khi có modal đè lên nó
const modalStack: string[] = [];
let previousBodyOverflow = "";

const Modal = ({
  onClose,
  closeOnEscape = false,
  closeOnBackdrop = false,
  children,
  size = "xs",
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalId = useId();
  const titleId = `${modalId}-title`;

  // Giữ onClose trong ref để listener không phải gắn lại sau mỗi lần render
  // (mọi nơi gọi đều truyền arrow function mới)
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const handleCloseModal = useCallback(() => {
    onCloseRef.current();
  }, []);

  // Ghi tên vào ngăn xếp và khoá scroll của nền khi modal mở
  useEffect(() => {
    if (modalStack.length === 0) {
      previousBodyOverflow = document.body.style.overflow;
    }
    modalStack.push(modalId);
    document.body.style.overflow = "hidden";

    return () => {
      const index = modalStack.indexOf(modalId);
      if (index !== -1) modalStack.splice(index, 1);

      if (modalStack.length === 0) {
        document.body.style.overflow = previousBodyOverflow;
      }
    };
  }, [modalId]);

  // Đưa focus vào modal lúc mở, trả về chỗ cũ lúc đóng.
  // Focus vào chính dialog chứ không vào phần tử đầu tiên: phần tử đó thường là
  // nút đóng, focus vào đó sẽ hiện vòng viền quanh dấu X mỗi lần mở.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    dialogRef.current?.focus();

    return () => previouslyFocused?.focus?.();
  }, []);

  // Escape để đóng và bẫy Tab bên trong modal.
  // Nghe ở document chứ không phải trên dialog: dialog render bằng thuộc tính
  // `open` (không phải showModal) nên không có focus trap sẵn, và phím chỉ tới
  // dialog khi focus đang nằm trong nó.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      // Có modal khác đè lên thì nhường phím cho nó
      if (modalStack[modalStack.length - 1] !== modalId) return;

      if (e.key === "Escape") {
        if (closeOnEscape) {
          e.preventDefault();
          onCloseRef.current();
        }
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.checkVisibility?.() ?? true);

      if (focusable.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // Focus đang ở ngoài (vd vừa bấm ra nền) thì kéo về đầu modal
      if (!dialog.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, modalId]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    // Chỉ tính cú bấm đúng vào nền, không tính cú bấm lọt từ trong modal ra
    if (closeOnBackdrop && e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // Giữ tham chiếu ổn định để component con không dựng lại mỗi render
  const ctx = useMemo(
    () => ({ handleCloseModal, titleId }),
    [handleCloseModal, titleId],
  );

  return createPortal(
    <ModalContext.Provider value={ctx}>
      <motion.div
        variants={variants}
        initial="hiddenBackDrop"
        animate="visibleBackDrop"
        exit="hiddenBackDrop"
        className={modalStyle.backdrop}
        onClick={handleBackdropClick}
      >
        <motion.dialog
          open
          ref={dialogRef}
          tabIndex={-1}
          aria-modal="true"
          aria-labelledby={titleId}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={classNames(modalStyle.modal, modalStyle[size])}
        >
          {children}
        </motion.dialog>
      </motion.div>
    </ModalContext.Provider>,
    document.getElementById("modal")!,
  );
};

export default Modal;
