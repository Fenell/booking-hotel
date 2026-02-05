import { createContext, useContext, useReducer, type ReactNode } from "react";

type RoomState = {
  isOpen: boolean;
  id?: string;
};

type RoomContextValue = RoomState & {
  openDialog: (isOpen: boolean, idRoom?: string) => void;
};

type OpenOrCloseDialog = {
  type: "OPEN_OR_CLOSE";
  isOpen: boolean;
  idRoom?: string;
};

type RoomAction = OpenOrCloseDialog;

const roomReducer = (state: RoomState, action: RoomAction): RoomState => {
  if (action.type === "OPEN_OR_CLOSE") {
    return { ...state, isOpen: action.isOpen, id: action.idRoom };
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

  const openDialog = (isOpen: boolean, idRoom?: string) => {
    dispatch({ type: "OPEN_OR_CLOSE", isOpen, idRoom });
  };

  const ctx: RoomContextValue = {
    isOpen: roomState.isOpen,
    id: roomState.id,
    openDialog,
  };

  return <RoomContext.Provider value={ctx}>{children}</RoomContext.Provider>;
};
