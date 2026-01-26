import { createContext, useContext, useReducer, type ReactNode } from "react";

type RoomState = {
  isOpen: boolean;
  id?: string;
};

type RoomContextValue = RoomState & {
  openDialog: (isOpen: boolean) => void;
};

type OpenOrCloseDialog = {
  type: "OPEN_OR_CLOSE";
  isOpen: boolean;
};

type RoomAction = OpenOrCloseDialog;

const roomReducer = (state: RoomState, action: RoomAction): RoomState => {
  if (action.type === "OPEN_OR_CLOSE") {
    return { ...state, isOpen: action.isOpen };
  }

  return state;
};

const RoomContext = createContext<RoomContextValue | null>(null);

export const useRoomContext = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) {
    throw new Error("Context is null");
  }
  return ctx;
};

export const RoomContextProvider = ({ children }: { children: ReactNode }) => {
  const [roomState, dispatch] = useReducer(roomReducer, {
    isOpen: false,
  });

  const openDialog = (isOpen: boolean) => {
    dispatch({ type: "OPEN_OR_CLOSE", isOpen });
  };

  const ctx: RoomContextValue = {
    isOpen: roomState.isOpen,
    openDialog,
  };

  return <RoomContext.Provider value={ctx}>{children}</RoomContext.Provider>;
};
