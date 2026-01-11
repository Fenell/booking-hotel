import type { ComponentPropsWithoutRef } from "react";
import sideBarStyle from "./Sidebar.module.css";
import CollapseMenu from "./CollapseMenu";
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
