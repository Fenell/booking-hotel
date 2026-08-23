import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

type RoomState = {
  isOpen: boolean;
  id?: string;
  isLoading: boolean;
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
    isLoading: false,
  });

  // Giữ tham chiếu ổn định: bộ cột của lưới được useMemo theo openDialog,
  // hàm mới mỗi render sẽ làm memo hoá đó vô nghĩa.
  const openDialog = useCallback((isOpen: boolean, idRoom?: string) => {
    dispatch({ type: "OPEN_OR_CLOSE", isOpen, idRoom });
  }, []);

  const ctx: RoomContextValue = useMemo(
    () => ({
      isOpen: roomState.isOpen,
      isLoading: roomState.isLoading,
      id: roomState.id,
      openDialog,
    }),
    [roomState.isOpen, roomState.isLoading, roomState.id, openDialog],
  );

  return <RoomContext.Provider value={ctx}>{children}</RoomContext.Provider>;
};
