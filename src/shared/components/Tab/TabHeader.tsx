import type { ReactNode } from "react";
import tabStyle from "./Tab.module.css";

const TabHeader = ({ children }: { children: ReactNode }) => {
  return <menu className={tabStyle["tab-custom__header"]}>{children}</menu>;
};

export default TabHeader;
