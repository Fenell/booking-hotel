import { useCollapseSelector } from "@app/store/hooks";
import boy from "@assets/boy.png";
import Breadcrumb from "./Breadcrumb";
import navBarStyle from "./NavBar.module.css";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

const UserMenu = () => {
  return createPortal(
    <ul className={navBarStyle.userMenu}>
      <li>
        <a>
          <i className="fa-regular fa-user"></i>
          <span>Tài khoản</span>
        </a>
      </li>
      <li>
        <a>
          <i className="fa-regular fa-arrow-right-from-bracket"></i>
          <span>Đăng xuất</span>
        </a>
      </li>
    </ul>,
    document.getElementById("menu")!,
  );
};

const NavBar = () => {
  const isCollapse = useCollapseSelector((state) => state.collapse.isCollapse);

  return (
    <motion.nav
      variants={{ collapse: { left: "70px" } }}
      animate={isCollapse ? "collapse" : ""}
      id={navBarStyle["nav-bar"]}
    >
      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Breadcrumb />
      </div>
      <ul className={navBarStyle.topNavBar}>
        <li className={navBarStyle.navItem}></li>
        <li className={navBarStyle.navItem}></li>
        <li className={navBarStyle.navItem}>
          <section>
            <a className={navBarStyle["notification"]}>
              <span className={navBarStyle["noti-bage"]}>5</span>
              <i className="fa-light fa-bell fa-lg"></i>
            </a>
          </section>
        </li>
        <li className={navBarStyle.navItem}>
          <section className={navBarStyle["user-info"]}>
            <a>
              <img src={boy} className={navBarStyle.avartar} />
            </a>
            <UserMenu />
          </section>
        </li>
      </ul>
    </motion.nav>
  );
};

export default NavBar;
