import type { ReactNode } from "react";
import { useTabContext } from "./TabProvider";
import tabStyle from "./Tab.module.css";
import classNames from "classnames";

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
      {/* { && (
      )} */}
      <div
        className={classNames(
          tabStyle["tab-custom__tab-content-item"],
          tabOpen !== idTab && tabStyle["hide"],
        )}
      >
        {children}
      </div>
    </>
  );
};

export default TabContentItem;
