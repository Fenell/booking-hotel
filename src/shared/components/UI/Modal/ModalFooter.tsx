import React, { type ReactNode } from "react";
import modalStyle from "./Modal.module.css";

const ModalFooter = ({ children }: { children: ReactNode }) => {
  return <div className={modalStyle["modal-footer"]}>{children}</div>;
};

export default ModalFooter;
