import { motion } from "framer-motion";
import SidebarItem from "./SidebarItem";
import sideBarStyle from "./Sidebar.module.css";
// import { menus } from "@constants/menu";
import { useQuery } from "@tanstack/react-query";
import { useCollapseDispatch, useCollapseSelector } from "@app/store/hooks";
import { toogleCollapse } from "@app/store/collapse-slice";
import { getMenu } from "@services/menu";
import CollapseButton from "./CollapseButton";

const SideBar = () => {
  const isCollapse = useCollapseSelector((state) => state.collapse.isCollapse);
  const dispatch = useCollapseDispatch();
  const { data, isPending } = useQuery({
    queryKey: ["menu"],
    queryFn: getMenu,
  });

  return (
    <motion.aside
      variants={{ collapse: { padding: "5px 5px", width: "58px" } }}
      animate={isCollapse ? "collapse" : ""}
      transition={{ duration: 0.8, type: "spring" }}
      className={sideBarStyle.sidebar}
    >
      <ul className={sideBarStyle["shop-menu"]}>
        <li>
          <span className={sideBarStyle.logo}>LOGO</span>
        </li>
        {isPending ? (
          <></>
        ) : (
          data?.map((menu) => (
            <SidebarItem
              key={menu.menuName}
              icon={menu.menuIcon ?? ""}
              menuLink={menu.menuLink ?? ""}
              menuName={menu.menuName}
              subMenus={menu.subMenu}
              hasChild={menu.hasChild}
              isActive={menu.isActive}
            />
          ))
        )}
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
            <CollapseButton onClick={() => dispatch(toogleCollapse())} />
            <span
              onClick={() => dispatch(toogleCollapse())}
              style={{ cursor: "pointer", color: "#fff" }}
            >
              Thu gọn
            </span>
          </div>
        </li>
      </ul>
    </motion.aside>
  );
};

export default SideBar;
