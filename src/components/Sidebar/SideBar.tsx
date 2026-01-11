import { motion } from "framer-motion";
import SidebarItem from "./SidebarItem";
import CollapseButton from "@components/Sidebar/CollapseButton";
import sideBarStyle from "./Sidebar.module.css";
// import { menus } from "@constants/menu";
import { toogleCollapse } from "@stores/collapse-slice";
import { useCollapseDispatch, useCollapseSelector } from "@stores/hooks";
import { useQuery } from "@tanstack/react-query";
import { getMenu } from "@apis/menu";

function SideBar() {
  const isCollapse = useCollapseSelector((state) => state.collapse.isCollapse);
  const dispatch = useCollapseDispatch();
  const { data, isFetching } = useQuery({
    queryKey: ["menu"],
    queryFn: getMenu,
  });

  if (isFetching) {
    return <span>loading</span>;
  }
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
        {data?.map((menu) => (
          <SidebarItem
            key={menu.menuName}
            icon={menu.menuIcon ?? ""}
            menuLink={menu.menuLink ?? ""}
            menuName={menu.menuName}
            subMenus={menu.subMenu}
            hasChild={menu.hasChild}
            isActive={menu.isActive}
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
}

export default SideBar;
