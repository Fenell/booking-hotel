import { useLocation } from "react-router";
import navBarStyle from "./NavBar.module.css";

const Breadcrumb = () => {
  const location = useLocation();

  let parentMenu = "Tổng quan";
  let icon = "";
  let menuName = "";

  if (location.state) {
    menuName = location.state.menuName;
    parentMenu = location.state.parentMenu;
    icon = location.state.icon;
  }

  return (
    <div className={navBarStyle["breadcrumb"]}>
      <div className={navBarStyle["breadcrumb-title"]}>
        <div>
          <i className={icon + " fa-fw"}></i>
        </div>
        {parentMenu}
      </div>
      <div className={navBarStyle["breadcrumb-child"]}>{menuName}</div>
    </div>
  );
};

export default Breadcrumb;
