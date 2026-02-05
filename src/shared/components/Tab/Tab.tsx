import React, { type ReactNode } from "react";
import tabStyle from "./Tab.module.css";
import { TabContextProvider } from "./TabProvider";

type TabProps = {
  onChangeTab?: (idTab: string) => void;
  children: ReactNode;
};

const Tab = ({ onChangeTab, children }: TabProps) => {
  return (
    <TabContextProvider onChangeTab={onChangeTab}>
      <div id={tabStyle["tab-custom"]}>{children}</div>
    </TabContextProvider>
  );
};

export default Tab;
