import { createContext, useContext } from "react";

type ModalContextValue = {
  handleCloseModal: () => void;
  /** Id gắn cho tiêu đề để dialog trỏ tới bằng aria-labelledby */
  titleId: string;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = () => {
  const ctx = useContext(ModalContext);

  if (!ctx)
    throw new Error("useModalContext phải được dùng bên trong <Modal>");

  return ctx;
};
