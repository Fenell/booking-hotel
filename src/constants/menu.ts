type Menu = MenuItem[];

export type MenuItem = {
  menuName: string;
  menuLink: string;
  iconMenu: string;
  isActive: boolean;
  subMenu?: MenuItem[] | null;
};

export const menus: Menu = [
  {
    menuName: "Tổng quan",
    menuLink: "/",
    iconMenu: "fa-regular fa-house ",
    subMenu: null,
    isActive: true,
  },
  {
    menuName: "Danh mục",
    menuLink: "",
    iconMenu: "fa-regular fa-list",
    isActive: true,
    subMenu: [
      {
        menuName: "Dịch vụ",
        menuLink: "color",
        iconMenu: "",
        isActive: true,
      },
      {
        menuName: "Kích thước",
        menuLink: "size",
        iconMenu: "",
        isActive: true,
      },
      {
        menuName: "Xuất xứ",
        menuLink: "2",
        iconMenu: "",
        isActive: true,
      },
      {
        menuName: "Chất liệu",
        menuLink: "5",
        iconMenu: "",
        isActive: true,
      },
    ],
  },
  {
    menuName: "Sản phẩm",
    menuLink: "",
    iconMenu: "fa-regular fa-database",
    isActive: true,
    subMenu: [
      {
        menuName: "Danh sách sản phẩm",
        menuLink: "product",
        iconMenu: "",
        isActive: true,
      },
      {
        menuName: "Danh sách biến thể",
        menuLink: "product-item",
        iconMenu: "",
        isActive: true,
      },
      {
        menuName: "Ảnh",
        menuLink: "image",
        iconMenu: "",
        isActive: true,
      },
    ],
  },
  {
    menuName: "Quản lý đơn hàng",
    menuLink: "",
    iconMenu: "fa-regular fa-memo-circle-check",
    isActive: true,
    subMenu: [
      {
        menuName: "Bán hàng",
        menuLink: "sales",
        iconMenu: "",
        isActive: true,
      },
      {
        menuName: "Đơn hàng",
        menuLink: "order",
        iconMenu: "",
        isActive: true,
      },
    ],
  },
  {
    menuName: "Khuyến mãi",
    menuLink: "q",
    iconMenu: "fa-regular fa-ticket-perforated",
    isActive: true,
    subMenu: [
      {
        menuName: "Voucher",
        menuLink: "a",
        iconMenu: "",
        isActive: true,
      },
      {
        menuName: "Sale",
        menuLink: "d",
        iconMenu: "",
        isActive: true,
      },
    ],
  },
  {
    menuName: "Quản lý nhân viên",
    menuLink: "n",
    iconMenu: "fa-regular fa-person",
    subMenu: null,
    isActive: true,
  },
];
