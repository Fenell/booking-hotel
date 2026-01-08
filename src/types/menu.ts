export type Menu = {
  id: string;
  menuCode: string;
  menuName: string;
  menuLink?: string;
  menuIcon?: string;
  isActive: boolean;
  menuLevel: string;
  isParent: boolean;
  parentMenu?: string;
  subMenu?: Menu[];
};
