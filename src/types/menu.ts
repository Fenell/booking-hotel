export type Menu = {
  id: string;
  menuCode: string;
  menuName: string;
  menuLink?: string;
  menuIcon?: string;
  isActive: boolean;
  menuLevel: string;
  hasChild: boolean;
  parentMenu?: string;
  subMenu?: Menu[] | null;
};
