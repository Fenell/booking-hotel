import sideBarStyle from "./Sidebar.module.css";
import SubMenu from "./SubMenu";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router";
import classNames from "classnames";
import ArrowDownIcon from "./ArrowDownIcon";
import type { Menu } from "shared/types/menu";
import { useCollapseDispatch, useCollapseSelector } from "@app/store/hooks";
import { toogleCollapseSubMenu } from "@app/store/collapse-slice";

type SidebarItemProp = {
  menuName: string;
  menuLink: string;
  icon: string;
  isActive: boolean;
  hasChild: boolean;
  subMenus: Menu[];
};

const SidebarItem = ({
  menuName,
  menuLink,
  icon,
  isActive,
  hasChild,
  subMenus,
}: SidebarItemProp) => {
  const subMenuId = useCollapseSelector((state) => state.collapse.subMenuId);
  const dispatch = useCollapseDispatch();
  const location = useLocation();

  const activeStyle = sideBarStyle.active;
  const parentActiceStyle = sideBarStyle["parent-active"];

  const divIcon = (
    <div>
      <i className={icon + " fa-fw"}></i>
    </div>
  );

  const menuWithSubMenu = (
    <>
      <button
        type="button"
        className={classNames(
          sideBarStyle["dropdown-btn"],
          location.state?.parentMenu === menuName ? parentActiceStyle : ""
        )}
        onClick={() => dispatch(toogleCollapseSubMenu({ menuId: menuName }))}
      >
        {icon && divIcon}
        <motion.span variants={{ collapse: { opacity: 0 } }}>
          {menuName}
        </motion.span>
        <ArrowDownIcon isExpanded={subMenuId === menuName} />
      </button>

      <SubMenu parentMenu={menuName} subMenus={subMenus} parentIcon={icon} />
    </>
  );

  const menuNoSubMenu = (
    <NavLink
      viewTransition
      style={{ display: isActive ? "" : "none" }}
      className={({ isActive }) => (isActive ? activeStyle : "")}
      to={menuLink}
      state={{ parentMenu: menuName, icon }}
    >
      {icon && divIcon}
      <motion.span variants={{ collapse: { opacity: 0 } }}>
        {menuName}
      </motion.span>
    </NavLink>
  );

  return <li>{hasChild ? menuWithSubMenu : menuNoSubMenu}</li>;
};

export default SidebarItem;
