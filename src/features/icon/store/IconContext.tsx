import { createContext, useContext, useReducer, type ReactNode } from "react";

type IconState = {
  isOpen: boolean;
  id?: string;
};

type IconContextValue = IconState & {
  openOrCloseDialog: (isOpen: boolean, id?: string) => void;
};

type OpenOrCloseAction = {
  type: "OPEN_OR_CLOSE";
  isOpen: boolean;
  id?: string;
};

type IconAction = OpenOrCloseAction;

const iconReducer = (state: IconState, action: IconAction): IconState => {
  if (action.type === "OPEN_OR_CLOSE") {
    return { ...state, isOpen: action.isOpen, id: action.id };
  }
  return state;
};

const IconContext = createContext<IconContextValue | null>(null);

export const useIconContext = () => {
  const ctx = useContext(IconContext);
  if (!ctx) {
    throw new Error("Context is not null");
  }

  return ctx;
};

export const IconContextProvider = ({ children }: { children: ReactNode }) => {
  const [iconState, dispatch] = useReducer(iconReducer, {
    isOpen: false,
    id: "",
  });

  const openOrCloseDialog = (isOpen: boolean, id?: string) => {
    dispatch({ type: "OPEN_OR_CLOSE", isOpen, id });
  };

  const ctx: IconContextValue = {
    isOpen: iconState.isOpen,
    id: iconState.id,
    openOrCloseDialog,
  };

  return <IconContext.Provider value={ctx}>{children}</IconContext.Provider>;
};
