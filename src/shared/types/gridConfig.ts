import type { ServiceResponse } from "@features/service/types/service.type";
import { type ColDef } from "ag-grid-community";
import type { RoomModel } from "./room";

export const defaultServiceConfig: ColDef<ServiceResponse>[] = [
  {
    field: "serviceCode",
    headerName: "Tên dịch vụ",
    maxWidth: 400,
    hide: false,
  },
  { field: "description", headerName: "Mô tả", hide: false },
  { field: "isFee", headerName: "Có phí", hide: true },
  { field: "price", headerName: "Giá dịch vụ", hide: true },
  { field: "description", headerName: "Ghi chus", hide: true },
];

export const defaultRoomConfig: ColDef<RoomModel>[] = [
  {
    field: "roomName",
    headerName: "Tên phòng",
    maxWidth: 500,
    minWidth: 400,
    hide: false,
  },
  {
    field: "roomType.typeName",
    headerName: "Loại",
    hide: false,
  },
  {
    field: "numberAdults",
    headerName: "Số người lớn",
    type: "numericColumn",
    hide: false,
  },
  {
    field: "numberChild",
    headerName: "Số trẻ em",
    type: "numericColumn",
    hide: false,
  },
  {
    field: "currentPrice",
    headerName: "Giá phòng",
    type: "numericColumn",
    hide: false,
  },
  {
    field: "priceWeekend",
    headerName: "Giá cuối tuần",
    type: "numericColumn",
    hide: false,
  },
  {
    field: "numberBedroom",
    headerName: "Số phòng ngủ",
    type: "numericColumn",
    hide: true,
  },
  {
    field: "numberBathRoom",
    headerName: "Số phòng tắm",
    type: "numericColumn",
    hide: true,
  },
  {
    field: "description",
    headerName: "Diễn giải",
    hide: false,
  },
];

// export const formatColNumber: ColDef[] = () => {
//   return;
//   {
//     valueFormatter: (e) => formatNumber(e.value);
//   }
// };
