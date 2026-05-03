import type { GridColumnModel } from "@syncfusion/ej2-react-grids";

export const defaultServiceConfig: GridColumnModel[] = [
  {
    field: "serviceCode",
    headerText: "Mã dịch vụ",
    width: 150,
    visible: false,
  },
  {
    field: "serviceName",
    headerText: "Tên dịch vụ",
    width: 250,
    visible: true,
  },
  { field: "nameTypeService", headerText: "Nhóm", visible: true, width: 150 },
  {
    field: "isFee",
    headerText: "Có phí",
    width: 100,
    visible: false,
    type: "boolean",
  },

  { field: "price", headerText: "Giá dịch vụ", visible: true, width: 150 },
  { field: "description", headerText: "Ghi chú", visible: true },
];

export const defaultRoomConfig: GridColumnModel[] = [
  {
    field: "id",
    isPrimaryKey: true,
    visible: false,
  },
  {
    field: "roomName",
    headerText: "Tên phòng",
    maxWidth: 500,
    minWidth: 400,
    visible: true,
  },
  {
    field: "roomType.typeName",
    headerText: "Loại",
    visible: true,
  },
  {
    field: "numberAdults",
    headerText: "Số người lớn",
    type: "numericColumn",
    visible: false,
  },
  {
    field: "numberChild",
    headerText: "Số trẻ em",
    type: "numericColumn",
    width: 90,
    visible: false,
  },
  {
    field: "currentPrice",
    headerText: "Giá phòng",
    type: "numericColumn",
    textAlign: "Right",
    visible: true,
  },
  {
    field: "priceWeekend",
    headerText: "Giá cuối tuần",
    type: "numericColumn",
    textAlign: "Right",
    visible: true,
  },
  {
    field: "numberBedroom",
    headerText: "Số phòng ngủ",
    type: "numericColumn",
    visible: true,
  },
  {
    field: "numberBathRoom",
    headerText: "Số phòng tắm",
    type: "numericColumn",
    visible: true,
  },
  {
    field: "description",
    headerText: "Diễn giải",
    width: 200,
    visible: false,
  },
  // { field: "status", headerName: "Trạng thái", width: 150 },
  // { field: "actions", headerName: "Thao tác", pinned: "right", width: 150 },
];

// export const formatColNumber: ColDef[] = () => {
//   return;
//   {
//     valueFormatter: (e) => formatNumber(e.value);
//   }
// };
