import type { ReactNode } from "react";
import { useModalContext } from "./ModalContext";
import modalStyle from "./Modal.module.css";

type ModalHeaderProps = {
  hasCloseButton?: boolean;
  title?: string;
  children?: ReactNode;
};

const ModalHeader = ({
  hasCloseButton = true,
  title,
  children,
}: ModalHeaderProps) => {
  const { handleCloseModal, titleId } = useModalContext();
  return (
    <div className={modalStyle["modal-header"]}>
      {children ? (
        // display: contents để bọc thêm một lớp lấy id mà không đổi layout flex
        <div id={titleId} style={{ display: "contents" }}>
          {children}
        </div>
      ) : (
        <p id={titleId} className={modalStyle["modal-title"]}>
          {title}
        </p>
      )}
      {hasCloseButton && (
        <button
          type="button"
          aria-label="Đóng"
          className={modalStyle["modal-close-btn"]}
          onClick={handleCloseModal}
        >
          <i className="fa-regular fa-xmark fa-lg"></i>
        </button>
      )}
    </div>
  );
};

export default ModalHeader;
