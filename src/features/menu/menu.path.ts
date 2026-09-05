import type { Menu } from "shared/types/menu";

/**
 * So khớp đường dẫn của menu với URL hiện tại.
 *
 * `menu_link` trong DB là đường dẫn TƯƠNG ĐỐI ("room", "report/revenue") còn
 * `location.pathname` luôn có dấu "/" đầu, nên phải chuẩn hoá rồi mới so được.
 */
export const toAbsolutePath = (path: string) =>
  `/${path.replace(/^\/+|\/+$/g, "")}`;

/**
 * Khớp cả route con — "/room/123" vẫn thuộc mục "room" — trừ trang gốc "/",
 * nếu không thì mọi trang đều tính là đang ở Tổng quan.
 */
export const isSamePath = (menuLink: string, pathname: string) => {
  const link = toAbsolutePath(menuLink);
  if (link === "/") return pathname === "/";
  return pathname === link || pathname.startsWith(`${link}/`);
};

export type MenuMatch = {
  /** Mục menu ứng với trang đang mở */
  menu: Menu;
  /** Nhóm chứa nó, nếu mục nằm ở cấp hai */
  parent?: Menu;
};

/**
 * Tìm mục menu ứng với URL. Dùng cho breadcrumb và cho việc tự mở đúng nhánh
 * trên thanh menu — cả hai đều suy từ URL nên F5 hay mở thẳng link vẫn đúng.
 */
export const findMenuByPath = (
  menus: Menu[] | undefined | null,
  pathname: string,
): MenuMatch | undefined => {
  if (!menus) return undefined;

  // Xét menu con trước: mục cấp hai cụ thể hơn mục gốc.
  for (const menu of menus) {
    const child = (menu.subMenu ?? []).find(
      (item) => item.menuLink && isSamePath(item.menuLink, pathname),
    );
    if (child) return { menu: child, parent: menu };
  }

  const root = menus.find(
    (menu) => menu.menuLink && isSamePath(menu.menuLink, pathname),
  );
  return root ? { menu: root } : undefined;
};
