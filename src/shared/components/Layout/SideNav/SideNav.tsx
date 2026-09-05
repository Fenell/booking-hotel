import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import classNames from "classnames";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import styles from "./SideNav.module.css";
import { getMenuIcon } from "./menuIcons";
import { findMenuByPath, useMenu } from "@features/menu";
import { useCollapseDispatch, useCollapseSelector } from "@app/store/hooks";
import { toogleCollapse } from "@app/store/collapse-slice";
import type { Menu } from "shared/types/menu";

/**
 * Điều hướng chính kiểu "rail + panel".
 *
 * - **Rail** (cột hẹp bên trái): các mục gốc. Mục có menu con thì bấm để đổi nội
 *   dung panel; mục không có con thì bấm là đi thẳng tới trang.
 * - **Panel**: danh sách mục con của nhóm đang chọn.
 *
 * Không dùng accordion: người dùng luôn thấy trọn một nhánh mà không phải gập
 * mở, và số lần bấm để tới một trang bất kỳ luôn là hai.
 */
const SideNav = () => {
  const { data } = useMenu();
  const { pathname } = useLocation();
  const isCollapse = useCollapseSelector((state) => state.collapse.isCollapse);
  const dispatch = useCollapseDispatch();

  const menus = (data ?? []).filter((m) => m.isActive);
  const groups = menus.filter((m) => m.hasChild);

  // Nhóm ứng với URL hiện tại — nguồn sự thật khi vừa tải trang hoặc F5.
  const match = findMenuByPath(menus, pathname);
  const groupOfPage = match?.parent?.menuCode;

  /* Nhóm người dùng chủ động chọn trên rail. Tách khỏi URL vì hai thứ này khác
     nhau: đang ở trang "Danh sách phòng" vẫn xem được danh sách nhóm "Báo cáo"
     mà chưa cần rời trang. */
  const [pickedGroup, setPickedGroup] = useState<string | null>(null);

  const activeGroupCode =
    pickedGroup ?? groupOfPage ?? groups[0]?.menuCode ?? null;
  const activeGroup = groups.find((g) => g.menuCode === activeGroupCode);
  const subMenus = (activeGroup?.subMenu ?? []).filter((m) => m.isActive);

  const renderRailItem = (menu: Menu) => {
    const Icon = getMenuIcon(menu.menuIcon);
    const label = menu.menuName;

    // Mục gốc không có con: bấm là điều hướng luôn
    if (!menu.hasChild) {
      return (
        <li key={menu.menuCode} className={styles.railItem}>
          <NavLink
            viewTransition
            to={menu.menuLink ?? ""}
            className={({ isActive }) =>
              classNames(styles.railBtn, isActive && styles.railBtnActive)
            }
          >
            <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
            <span className={styles.srOnly}>{label}</span>
          </NavLink>
          <span className={styles.railTip} role="presentation">
            {label}
          </span>
        </li>
      );
    }

    const isActive = menu.menuCode === activeGroupCode;
    return (
      <li key={menu.menuCode} className={styles.railItem}>
        <button
          type="button"
          aria-current={menu.menuCode === groupOfPage ? "true" : undefined}
          aria-expanded={isActive}
          className={classNames(styles.railBtn, isActive && styles.railBtnActive)}
          onClick={() => {
            setPickedGroup(menu.menuCode);
            if (isCollapse) dispatch(toogleCollapse());
          }}
        >
          <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
          <span className={styles.srOnly}>{label}</span>
        </button>
        <span className={styles.railTip} role="presentation">
          {label}
        </span>
      </li>
    );
  };

  return (
    <nav
      aria-label="Điều hướng chính"
      data-collapsed={isCollapse}
      className={styles.sideNav}
    >
      <div className={styles.rail}>
        <div className={styles.brand} aria-hidden="true">
          BH
        </div>

        <ul className={styles.railList}>{menus.map(renderRailItem)}</ul>

        <button
          type="button"
          className={styles.collapseBtn}
          aria-label={isCollapse ? "Mở rộng menu" : "Thu gọn menu"}
          aria-expanded={!isCollapse}
          onClick={() => dispatch(toogleCollapse())}
        >
          {isCollapse ? (
            <PanelLeftOpen size={18} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <PanelLeftClose size={18} strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Panel bị ẩn hẳn khỏi cây trợ năng khi thu gọn, không chỉ ẩn bằng mắt */}
      <div className={styles.panel} hidden={isCollapse}>
        <h2 className={styles.panelTitle}>{activeGroup?.menuName ?? ""}</h2>
        <ul className={styles.panelList}>
          {subMenus.map((item) => {
            const Icon = getMenuIcon(item.menuIcon);
            return (
              <li key={item.menuCode}>
                <NavLink
                  viewTransition
                  to={item.menuLink ?? ""}
                  className={({ isActive }) =>
                    classNames(styles.panelLink, isActive && styles.panelLinkActive)
                  }
                >
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  <span>{item.menuName}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default SideNav;
