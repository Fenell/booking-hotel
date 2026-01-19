import type { IconResponse } from "@features/icon/types/icon.type";
import { createContext, useContext, useReducer, type ReactNode } from "react";

type ServiceState = {
  isOpen: boolean;
  id?: string;
  icon?: IconResponse | null;
};

type ServiceContextValue = ServiceState & {
  openOrCloseDialog: (isOpen: boolean, id?: string) => void;
  selectIcon: (icon?: IconResponse | null) => void;
};

type OpenOrCloseDialog = {
  type: "OPEN_OR_CLOSE";
  isOpen: boolean;
  id?: string;
};

type SelectIcon = {
  type: "SELECT_ICON";
  icon?: IconResponse | null;
};

type ServiceAction = OpenOrCloseDialog | SelectIcon;

const serviceReducer = (
  state: ServiceState,
  action: ServiceAction,
): ServiceState => {
  if (action.type === "OPEN_OR_CLOSE") {
    return { ...state, isOpen: action.isOpen, id: action.id };
  }
  if (action.type === "SELECT_ICON") {
    return { ...state, icon: action.icon };
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

  const selectIcon = (icon?: IconResponse | null) => {
    dispatch({ type: "SELECT_ICON", icon });
  };

  const ctx: ServiceContextValue = {
    isOpen: serviceState.isOpen,
    id: serviceState.id,
    icon: serviceState.icon,
    openOrCloseDialog,
    selectIcon,
  };

  return (
    <ServiceContext.Provider value={ctx}> {children}</ServiceContext.Provider>
  );
};
