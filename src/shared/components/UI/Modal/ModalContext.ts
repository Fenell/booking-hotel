import { createContext, useContext } from "react";

type ModalContextValue = {
  handleCloseModal: () => void;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = () => {
  const ctx = useContext(ModalContext);

  if (!ctx) throw new Error("Modal not wrapper");

  return ctx;
};
