import type { ServiceResponse } from "@features/service/types/service.type";

import type { RoomModel } from "./room";
import type { ColumnDef } from "@shared/components/DataGrid";

export const defaultServiceConfig: ColumnDef<ServiceResponse>[] = [
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

export const defaultRoomConfig: ColumnDef<RoomModel>[] = [
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
    width: 90,
    hide: false,
  },
  {
    field: "currentPrice",
    headerName: "Giá phòng",
    type: "numericColumn",
    enableSummary: true,
    align: "right",
    hide: false,
  },
  {
    field: "priceWeekend",
    headerName: "Giá cuối tuần",
    type: "numericColumn",
    align: "right",
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
    width: 200,
    hide: false,
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
