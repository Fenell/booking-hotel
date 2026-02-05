import React, { type ReactNode } from "react";
import tabStyle from "./Tab.module.css";

const TabContent = ({ children }: { children: ReactNode }) => {
  return <div className={tabStyle["tab-custom__tab-content"]}>{children}</div>;
};

export default TabContent;
