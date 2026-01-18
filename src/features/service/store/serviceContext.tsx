import { createContext, useContext, useReducer, type ReactNode } from "react";

type ServiceState = {
  isOpen: boolean;
  id?: string;
};

type ServiceContextValue = ServiceState & {
  openOrCloseDialog: (isOpen: boolean, id?: string) => void;
};

type OpenOrCloseDialog = {
  type: "OPEN_OR_CLOSE";
  isOpen: boolean;
  id?: string;
};

type ServiceActiion = OpenOrCloseDialog;

const serviceReducer = (
  state: ServiceState,
  action: ServiceActiion,
): ServiceState => {
  if (action.type === "OPEN_OR_CLOSE") {
    return { ...state, isOpen: action.isOpen, id: action.id };
  }
  return state;
};

const ServiceContext = createContext<ServiceContextValue | null>(null);

export const useServiceContext = () => {
  const ctx = useContext(ServiceContext);
  if (!ctx) {
    throw new Error("Context is null");
  }

  return ctx;
};

export const ServiceContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [serviceState, dispatch] = useReducer(serviceReducer, {
    isOpen: false,
  });

  const openOrCloseDialog = (isOpen: boolean, id?: string) => {
    dispatch({ type: "OPEN_OR_CLOSE", isOpen, id });
  };

  const ctx: ServiceContextValue = {
    isOpen: serviceState.isOpen,
    id: serviceState.id,
    openOrCloseDialog,
  };

  return (
    <ServiceContext.Provider value={ctx}> {children}</ServiceContext.Provider>
  );
};
