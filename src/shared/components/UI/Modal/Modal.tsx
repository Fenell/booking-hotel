import React, { type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";
import { motion } from "motion/react";
import classNames from "classnames";
import { ModalContext } from "./ModalContext";

type ModalProps = {
  children: ReactNode;
  size: string;
  onClose: () => void;
  closeOnEscape: boolean;
};

const Modal = ({
  onClose,
  closeOnEscape,
  children,
  size = "xs",
}: ModalProps) => {
  const handleCloseModal = () => {
    if (onClose) {
      // console.log("close modal");
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (closeOnEscape) {
        onClose();
      } else {
        e.preventDefault();
      }
    }
  };
  const ctx = {
    handleCloseModal,
  };

  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    hiddenBackDrop: { opacity: 0 },
    visibleBackDrop: { opacity: 1 },
  };

  return createPortal(
    <>
      <ModalContext.Provider value={ctx}>
        <motion.div
          variants={variants}
          initial="hiddenBackDrop"
          animate="visibleBackDrop"
          exit="hiddenBackDrop"
          className="backdrop"
          // onClick={handleCloseModal}
        >
          <motion.dialog
            open
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            // ref={modalRef}
            className={classNames("modal", size)}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.dialog>
        </motion.div>
      </ModalContext.Provider>
    </>,
    document.getElementById("modal")!
  );
};

export default Modal;
