import { useEffect, type ReactNode } from "react";
import { useTabContext } from "./TabProvider";
import classNames from "classnames";
import { motion } from "motion/react";
import tabStyle from "./Tab.module.css";

type TabHeaderItemProps = {
  idTab: string;
  title: string;
  selectDefault?: boolean;
  children?: ReactNode;
};

export const TabHeaderItem = ({
  idTab = "1",
  title,
  selectDefault,
  children,
}: TabHeaderItemProps) => {
  const { tabOpen, toggleTab } = useTabContext();

  const isTabSelected = tabOpen === idTab;

  useEffect(() => {
    if (selectDefault) {
      toggleTab(idTab);
    }
  }, [idTab, selectDefault]);

  return (
    <li className={tabStyle["tab-custom__header-item"]} key={idTab}>
      <button
        className={classNames(tabStyle["tab-custom__header-button"], {
          [tabStyle["tab-custom__header-button--focused"]]: isTabSelected,
        })}
        onClick={() => toggleTab(idTab)}
      >
        {children ? children : title}
      </button>
      {isTabSelected && (
        <motion.div
          layoutId="tab"
          className={tabStyle["tab-custom__active-tab-indicator"]}
        ></motion.div>
      )}
    </li>
  );
};

export default TabHeaderItem;
