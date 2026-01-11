import React, { type ReactNode } from "react";

const ModalFooter = ({ children }: { children: ReactNode }) => {
  return <div className="modal-footer">{children}</div>;
};

export default ModalFooter;
