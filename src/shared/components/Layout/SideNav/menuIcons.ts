import {
  Banknote,
  BedDouble,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChartLine,
  ChartPie,
  ConciergeBell,
  CircleDot,
  CreditCard,
  HandPlatter,
  Hotel,
  Layers,
  LayoutDashboard,
  List,
  Mail,
  Settings,
  Shapes,
  ShieldCheck,
  Tags,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Tra icon Lucide theo giá trị cột `menus.menu_icon` trong DB (tên kebab-case,
 * ví dụ "bed-double" — xem `BE/db/2026-09-06_menu-icon-lucide.sql`).
 *
 * Khai tường minh từng icon chứ không `import * as icons`: import sao sẽ kéo cả
 * ~1500 icon vào bundle, mất sạch tree-shaking.
 *
 * Thêm menu mới thì thêm một dòng ở đây; quên thì FE hiện icon mặc định chứ
 * không vỡ giao diện.
 */
const MENU_ICONS: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  // Vận hành
  "concierge-bell": ConciergeBell,
  "calendar-days": CalendarDays,
  "calendar-check": CalendarCheck,
  users: Users,
  "credit-card": CreditCard,
  // Lưu trú
  hotel: Hotel,
  "building-2": Building2,
  "bed-double": BedDouble,
  layers: Layers,
  // Danh mục
  list: List,
  "hand-platter": HandPlatter,
  tags: Tags,
  shapes: Shapes,
  // Báo cáo
  "chart-line": ChartLine,
  banknote: Banknote,
  "chart-pie": ChartPie,
  // Hệ thống
  settings: Settings,
  "user-cog": UserCog,
  "shield-check": ShieldCheck,
  mail: Mail,
};

/** Icon dùng khi menu chưa khai hoặc khai tên không có trong bảng trên. */
export const FALLBACK_ICON = CircleDot;

export const getMenuIcon = (name?: string | null): LucideIcon =>
  (name && MENU_ICONS[name]) || FALLBACK_ICON;
