import { useLocation } from "react-router";
import navBarStyle from "./NavBar.module.css";
import { findMenuByPath, useMenu } from "@features/menu";

/**
 * Vệt đường dẫn trên thanh trên cùng.
 *
 * Suy từ URL + cây menu chứ không đọc `location.state` như bản trước: state chỉ
 * tồn tại khi người dùng bấm qua thanh menu, nên F5 hay mở thẳng link là mất —
 * mọi trang khi đó đều hiện "Tổng quan".
 */
const Breadcrumb = () => {
  const { pathname } = useLocation();
  const { data } = useMenu();

  const match = findMenuByPath(data, pathname);

  // Chưa tải xong menu hoặc route không nằm trong cây menu (trang demo, 404…)
  if (!match) return <div className={navBarStyle["breadcrumb"]} />;

  const { menu, parent } = match;
  const icon = menu.menuIcon || parent?.menuIcon || "";

  return (
    <nav aria-label="Vệt đường dẫn" className={navBarStyle["breadcrumb"]}>
      <div className={navBarStyle["breadcrumb-title"]}>
        {icon && (
          <div>
            <i className={`${icon} fa-fw`} aria-hidden="true"></i>
          </div>
        )}
        {parent?.menuName ?? menu.menuName}
      </div>
      {parent && (
        <div className={navBarStyle["breadcrumb-child"]}>{menu.menuName}</div>
      )}
    </nav>
  );
};

export default Breadcrumb;
