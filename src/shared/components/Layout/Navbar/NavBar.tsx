import { useCollapseSelector } from "@app/store/hooks";
import boy from "@assets/boy.png";
import Breadcrumb from "./Breadcrumb";
import navBarStyle from "./NavBar.module.css";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { useEffect, useRef, useState, type RefObject } from "react";
import { useAuthContext } from "@shared/context/AuthContext";
import { useNavigate } from "react-router";

const UserMenu = ({
  open,
  menuRef,
}: {
  open: boolean;
  menuRef: RefObject<HTMLUListElement | null>;
}) => {
  const navigate = useNavigate();
  const { onLogout } = useAuthContext();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };
  return createPortal(
    <ul
      ref={menuRef}
      className={classNames(navBarStyle.userMenu, open && navBarStyle.open)}
    >
      <li>
        <a>
          <i className="fa-regular fa-user"></i>
          <span>Tài khoản</span>
        </a>
      </li>
      <li>
        <a onClick={handleLogout}>
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
  const [open, setOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !avatarRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  return (
    <nav id={navBarStyle["nav-bar"]} data-collapsed={isCollapse}>
      <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
        <Breadcrumb />
      </div>
      <ul className={navBarStyle.topNavBar}>
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
          <section>
            <a>
              <i className="fa-regular fa-gear fa-lg"></i>
            </a>
          </section>
        </li>
        <li
          className={navBarStyle.navItem}
          onClick={() => setOpen((prev) => !prev)}
        >
          <section className={navBarStyle["user-info"]} ref={avatarRef}>
            <a>
              <img src={boy} className={navBarStyle.avartar} />
            </a>
            <UserMenu open={open} menuRef={menuRef} />
          </section>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
