import type { ComponentPropsWithoutRef } from "react";
import CollapseMenu from "../Sidebar/CollapseMenu";
import navBarStyle from "./NavBar.module.css";

type CollapseButtonProp = {} & ComponentPropsWithoutRef<"button">;

const CollapseButton = ({ ...prop }: CollapseButtonProp) => {
  const isCollapse = true;
  // useSelector((state) => state.collapse.isCollapse);

  return (
    <button id={navBarStyle["toggle-btn"]} {...prop}>
      <CollapseMenu isExpanded={!isCollapse} />
    </button>
  );
};

export default CollapseButton;
