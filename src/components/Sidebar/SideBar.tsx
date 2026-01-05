import { motion } from "framer-motion";
import sideBarStyle from "./SideBar.module.css";
import SidebarItem from "./SidebarItem";
import CollapseButton from "@components/Navbar/CollapseButton";
import { menus } from "@constants/menu";

function SideBar() {
  // const isCollapse = useSelector((state) => state.collapse.isCollapse);
  // const dispatch = useDispatch();

  return (
    <motion.aside
      variants={{ collapse: { padding: "5px 5px", width: "58px" } }}
      animate={isCollapse ? "collapse" : ""}
      transition={{ duration: 0.8, type: "spring" }}
      id={sideBarStyle.sidebar}
    >
      <ul className={sideBarStyle["shop-menu"]}>
        <li>
          <span className={sideBarStyle.logo}>LOGO</span>
        </li>
        {menus.map((menu) => (
          <SidebarItem
            key={menu.menuName}
            icon={menu.iconMenu}
            menuLink={menu.menuLink}
            menuName={menu.menuName}
            subMenus={menu.subMenu}
          />
        ))}
      </ul>
      <ul className={sideBarStyle["account-menu"]}>
        <li>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CollapseButton
              onClick={() => dispatch(collapseActions.toogleCollapse())}
            />
            <span
              onClick={() => dispatch(collapseActions.toogleCollapse())}
              style={{ cursor: "pointer" }}
            >
              Thu gọn
            </span>
          </div>
        </li>
      </ul>
    </motion.aside>
  );
}

export default SideBar;
