import type { ComponentPropsWithoutRef } from "react";
import CollapseMenu from "./CollapseMenu";
import sideBarStyle from "./Sidebar.module.css";
type CollapseButtonProp = {} & ComponentPropsWithoutRef<"button">;

const CollapseButton = ({ ...prop }: CollapseButtonProp) => {
  const isCollapse = true;
  // useSelector((state) => state.collapse.isCollapse);

  return (
    <button id={sideBarStyle["toggle-btn"]} {...prop}>
      <CollapseMenu isExpanded={!isCollapse} />
    </button>
  );
};

export default CollapseButton;
