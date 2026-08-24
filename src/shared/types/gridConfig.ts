import type { GridColumnModel } from "@syncfusion/ej2-react-grids";

export const defaultServiceConfig: GridColumnModel[] = [
  {
    field: "id",
    visible: false,
    isPrimaryKey: true,
  },
  {
    field: "serviceCode",
    headerText: "Mã dịch vụ",
    width: 120,
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
    field: "kind",
    headerText: "Loại",
    width: 110,
    visible: true,
  },

  {
    field: "price",
    headerText: "Giá dịch vụ",
    visible: true,
    width: 150,
    format: "N0",
    type: "number",
    textAlign: "Right",
  },
  { field: "unit", headerText: "Đơn vị", width: 60, visible: false },
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
    type: "number",
    visible: false,
  },
  {
    field: "numberChild",
    headerText: "Số trẻ em",
    type: "number",
    width: 90,
    visible: false,
  },
  {
    field: "currentPrice",
    headerText: "Giá phòng",
    type: "number",
    textAlign: "Right",
    visible: true,
  },
  {
    field: "priceWeekend",
    headerText: "Giá cuối tuần",
    type: "number",
    textAlign: "Right",
    visible: true,
  },
  {
    field: "numberBedroom",
    headerText: "Số phòng ngủ",
    type: "number",
    visible: true,
  },
  {
    field: "numberBathRoom",
    headerText: "Số phòng tắm",
    type: "number",
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
