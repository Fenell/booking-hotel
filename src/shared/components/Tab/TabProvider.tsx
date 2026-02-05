import { createContext, useContext, useReducer, type ReactNode } from "react";

type TabState = {
  tabOpen: string;
};

type ChangeTab = {
  type: "CHANGE_TAB";
  idTab: string;
};

type TabAction = ChangeTab;

const tabReducer = (state: TabState, action: TabAction): TabState => {
  if (action.type === "CHANGE_TAB") {
    return { ...state, tabOpen: action.idTab };
  }
  return state;
};

export type TabContextValue = TabState & {
  toggleTab: (idTab: string) => void;
  onChangeTab?: (idTab: string) => void;
};

const TabContext = createContext<TabContextValue | null>(null);

export const useTabContext = () => {
  const ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error("Context is null");
  }
  return ctx;
};

export const TabContextProvider = ({
  children,
  onChangeTab,
}: {
  children: ReactNode;
  onChangeTab?: (idTab: string) => void;
}) => {
  const [tabState, dispatch] = useReducer(tabReducer, {
    tabOpen: "",
  });

  const toggleTab = (idTab: string) => {
    dispatch({ type: "CHANGE_TAB", idTab });
    onChangeTab?.(idTab);
  };

  const contextValue: TabContextValue = {
    toggleTab,
    tabOpen: tabState.tabOpen,
    onChangeTab,
  };
  return (
    <TabContext.Provider value={contextValue}>{children}</TabContext.Provider>
  );
};
