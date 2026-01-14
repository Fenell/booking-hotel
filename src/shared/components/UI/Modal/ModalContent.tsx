import React, { type ReactNode } from "react";
import modalStyle from "./Modal.module.css";

const ModalContent = ({ children }: { children: ReactNode }) => {
  return <div className={modalStyle["modal-content"]}>{children}</div>;
};

export default ModalContent;
