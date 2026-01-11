import type { ReactNode } from "react";
import { useModalContext } from "./Modal";

type ModalHeaderProps = {
  hasCloseButton: boolean;
  title: string;
  children: ReactNode;
};

const ModalHeader = ({ hasCloseButton, title, children }: ModalHeaderProps) => {
  const { handleCloseModal } = useModalContext();
  return (
    <div className="modal-header">
      {children ? children : <h3 className="modal-title">{title}</h3>}
      {hasCloseButton && (
        <button className="modal-close-btn" onClick={handleCloseModal}>
          <i className="fa-regular fa-xmark fa-lg"></i>
        </button>
      )}
    </div>
  );
};

export default ModalHeader;
