import type { ColumnDef } from "@shared/components/DataGrid";
import GridRowAction from "@shared/components/UI/GridRowAction/GridRowAction";
import type { RoomModel } from "../types/room.type";
import StatusSwitch from "./StatusSwitch";

type CreateRoomColOptions = {
  onEdit: (id: string) => void;
  /** Gọi sau khi đổi trạng thái thành công để ghi bản mới vào cache lưới */
  onStatusUpdated: (room: RoomModel) => void;
};

/**
 * Cột của lưới Phòng.
 *
 * Cấu hình cột (thứ tự, ẩn/hiện, độ rộng) do chính DataGrid lưu vào
 * localStorage qua prop `gridKey`, nên ở đây chỉ khai mặc định.
 */
const createRoomCol = ({
  onEdit,
  onStatusUpdated,
}: CreateRoomColOptions): ColumnDef<RoomModel>[] => [
  {
    field: "roomName",
    headerText: "Tên phòng",
    width: 260,
    minWidth: 180,
    pinned: "left",
    filter: { type: "text" },
  },
  {
    field: "roomType.typeName",
    headerText: "Loại",
    width: 140,
    filter: { type: "text" },
  },
  {
    field: "currentPrice",
    headerText: "Giá phòng",
    width: 130,
    align: "right",
    format: "N0",
    filter: { type: "number" },
    aggregate: "sum",
  },
  {
    field: "priceWeekend",
    headerText: "Giá cuối tuần",
    width: 140,
    align: "right",
    format: "N0",
    filter: { type: "number" },
    aggregate: "sum",
  },
  {
    field: "numberBedroom",
    headerText: "Số phòng ngủ",
    width: 130,
    align: "right",
    format: "N0",
  },
  {
    field: "numberBathRoom",
    headerText: "Số phòng tắm",
    width: 130,
    align: "right",
    format: "N0",
  },
  {
    field: "numberAdults",
    headerText: "Số người lớn",
    width: 130,
    align: "right",
    format: "N0",
    visible: false,
  },
  {
    field: "numberChild",
    headerText: "Số trẻ em",
    width: 120,
    align: "right",
    format: "N0",
    visible: false,
  },
  {
    field: "description",
    headerText: "Diễn giải",
    width: 220,
    visible: false,
    filter: { type: "text" },
  },
  {
    field: "status",
    headerText: "Trạng thái",
    width: 120,
    align: "center",
    sortable: false,
    tooltip: false,
    cell: (row) => (
      <StatusSwitch data={row} onSuccessUpdateStatus={onStatusUpdated} />
    ),
  },
  {
    field: "actions",
    headerText: "Thao tác",
    width: 110,
    align: "center",
    pinned: "right",
    sortable: false,
    resizable: false,
    tooltip: false,
    cell: (row) => (
      <GridRowAction
        data={row}
        actions={["edit"]}
        onEdit={(edited) => onEdit(edited.id)}
      />
    ),
  },
];

export default createRoomCol;
