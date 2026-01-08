import { useCollapseSelector } from "@stores/hooks";
import boy from "../../assets/boy.png";
import Breadcrumb from "./Breadcrumb";
import navBarStyle from "./NavBar.module.css";
import { motion } from "framer-motion";

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
      <ul>
        <li></li>
        <li></li>
        <li>
          <a href="">
            <span className={navBarStyle["notification"]}>
              <span className={navBarStyle["noti-bage"]}>5</span>
              <i className="fa-light fa-bell fa-lg"></i>
            </span>
          </a>
        </li>
        <li>
          <a href="">
            <span>
              <img src={boy} className={navBarStyle.avartar} />
            </span>
          </a>
        </li>
      </ul>
    </motion.nav>
  );
};

export default NavBar;
