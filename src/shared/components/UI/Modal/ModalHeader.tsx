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
  const { handleCloseModal } = useModalContext();
  return (
    <div className={modalStyle["modal-header"]}>
      {children ? (
        children
      ) : (
        <h3 className={modalStyle["modal-title"]}>{title}</h3>
      )}
      {hasCloseButton && (
        <button
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
