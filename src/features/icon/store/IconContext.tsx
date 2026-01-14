import { createContext, useContext, useReducer, type ReactNode } from "react";

type IconState = {
  isOpen: boolean;
};

type IconContextValue = IconState & {
  openOrCloseDialog: (isOpen: boolean) => void;
};

type OpenOrCloseAction = {
  type: "OPEN_OR_CLOSE";
  isOpen: boolean;
};

type IconAction = OpenOrCloseAction;

const iconReducer = (state: IconState, action: IconAction): IconState => {
  if (action.type === "OPEN_OR_CLOSE") {
    console.log(state.isOpen);
    return { ...state, isOpen: action.isOpen };
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
  });

  const openOrCloseDialog = (isOpen: boolean) => {
    console.log(isOpen);
    dispatch({ type: "OPEN_OR_CLOSE", isOpen });
  };

  const ctx: IconContextValue = {
    isOpen: iconState.isOpen,
    openOrCloseDialog,
  };

  return <IconContext.Provider value={ctx}>{children}</IconContext.Provider>;
};
