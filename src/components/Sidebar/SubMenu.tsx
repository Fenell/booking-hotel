import { motion } from "framer-motion";
import sideBarStyle from "./SideBar.module.css";
import { NavLink } from "react-router";
import type { MenuItem } from "@constants/menu";

type SubMenuProp = {
  subMenus?: MenuItem[];
  parentMenu: string;
  parentIcon: string;
};

const SubMenu = ({ subMenus, parentMenu, parentIcon }: SubMenuProp) => {
  // const subMenuId = useSelector((state) => state.collapse.subMenuId);

  return (
    <>
      <motion.ul
        initial={{ height: 0 }}
        animate={subMenuId === parentMenu ? { height: "auto" } : { height: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={sideBarStyle["sub-menu"]}
      >
        {subMenus?.map((item) => (
          <li key={item.menuName}>
            <NavLink
              viewTransition
              className={({ isActive }) =>
                isActive ? sideBarStyle.active : ""
              }
              to={item.menuLink}
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
