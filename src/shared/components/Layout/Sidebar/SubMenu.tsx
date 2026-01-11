import { motion } from "framer-motion";
import sideBarStyle from "./Sidebar.module.css";
import { NavLink } from "react-router";
// import type { MenuItem } from "@constants/menu";
import type { Menu } from "shared/types/menu";
import { useCollapseSelector } from "@app/store/hooks";

type SubMenuProp = {
  subMenus: Menu[];
  parentMenu: string;
  parentIcon: string;
};

const SubMenu = ({ subMenus, parentMenu, parentIcon }: SubMenuProp) => {
  const subMenuId = useCollapseSelector((state) => state.collapse.subMenuId);

  return (
    <>
      <motion.ul
        initial={{ height: 0 }}
        animate={subMenuId === parentMenu ? { height: "auto" } : { height: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={sideBarStyle["sub-menu"]}
      >
        {subMenus.map((item) => (
          <li key={item.menuName}>
            <NavLink
              viewTransition
              style={{ display: item.isActive ? "" : "none" }}
              className={({ isActive }) =>
                isActive ? sideBarStyle.active : ""
              }
              to={item.menuLink ?? ""}
              state={{
                menuName: item.menuName,
                parentMenu: parentMenu,
                icon: parentIcon,
              }}
            >
              {item.menuName}
            </NavLink>
          </li>
        ))}
      </motion.ul>
    </>
  );
};

export default SubMenu;
