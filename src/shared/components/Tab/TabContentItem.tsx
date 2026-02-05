import type { ReactNode } from "react";
import { useTabContext } from "./TabProvider";
import tabStyle from "./Tab.module.css";

export const TabContentItem = ({
  idTab,
  children,
}: {
  idTab: string;
  children: ReactNode;
}) => {
  const { tabOpen } = useTabContext();
  return (
    <>
      {tabOpen === idTab && (
        <div className={tabStyle["tab-custom__tab-content-item"]}>
          {children}
        </div>
      )}
    </>
  );
};

export default TabContentItem;
