import type { ColumnDef } from "@shared/components/DataGrid";
import demoStyle from "../style/demoGrid.module.css";

/** Dòng dữ liệu THẬT của bảng rooms (sau camelcaseKeys) */
export type DemoRoom = {
  id: string;
  roomTypeId: string;
  roomNumber: number;
  roomName: string;
  status: number; // 0 = Đã đặt, 1 = Trống, 2 = Ngưng khai thác
  currentPrice: number;
  priceWeekend: number;
  acreage: number;
  numberAdults?: number;
  numberChild?: number;
  numberBedroom: number;
  numberBathroom: number;
  numberBed: number;
  description?: string;
  location?: string;
  imageUrl?: string;
  createdDate?: string;
};

const STATUS_LABELS: Record<number, { label: string; className: string }> = {
  0: { label: "Đã đặt", className: "statusBooked" },
  1: { label: "Trống", className: "statusEmpty" },
  2: { label: "Ngưng", className: "statusStop" },
};

type DemoColsOptions = {
  onEdit: (row: DemoRoom) => void;
};

/** Cột khai báo tay cho grid server-side — phủ đủ tính năng của DataGrid */
export const createDemoRoomCols = ({
  onEdit,
}: DemoColsOptions): ColumnDef<DemoRoom>[] => [
  {
    field: "roomName",
    headerText: "Tên phòng",
    width: 220,
    pinned: "left",
    filter: { type: "text" },
  },
  {
    field: "roomNumber",
    headerText: "Số phòng",
    width: 100,
    align: "center",
    filter: { type: "number" },
  },
  {
    field: "status",
    headerText: "Trạng thái",
    width: 110,
    align: "center",
    sortable: false,
    cell: (row) => {
      const st = STATUS_LABELS[row.status];
      return st ? (
        <span className={demoStyle[st.className]}>{st.label}</span>
      ) : (
        row.status
      );
    },
  },
  {
    field: "currentPrice",
    headerText: "Giá ngày thường",
    width: 140,
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
    field: "acreage",
    headerText: "Diện tích (m²)",
    width: 120,
    align: "right",
    filter: { type: "number" },
  },
  {
    field: "numberAdults",
    headerText: "Người lớn",
    width: 100,
    align: "center",
    visible: false,
  },
  {
    field: "numberChild",
    headerText: "Trẻ em",
    width: 90,
    align: "center",
    visible: false,
  },
  { field: "numberBedroom", headerText: "Phòng ngủ", width: 100, align: "center" },
  { field: "numberBathroom", headerText: "Phòng tắm", width: 100, align: "center" },
  {
    field: "createdDate",
    headerText: "Ngày tạo",
    width: 120,
    align: "center",
    // camelToSnake("createdDate") = "create_date" ≠ cột thật "created_date"
    // → ca minh họa bắt buộc phải override serverField
    serverField: "created_date",
    cell: (row) =>
      row.createdDate
        ? new Date(row.createdDate).toLocaleDateString("vi-VN")
        : "",
  },
  {
    field: "description",
    headerText: "Diễn giải",
    width: 200,
    visible: false,
    filter: { type: "text" },
  },
  {
    field: "actions",
    headerText: "Thao tác",
    width: 100,
    align: "center",
    pinned: "right",
    sortable: false,
    resizable: false,
    cell: (row) => (
      <button
        type="button"
        title="Chỉnh sửa"
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#2563eb",
          fontSize: 14,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(row);
        }}
      >
        <i className="fa-light fa-pen-to-square" />
      </button>
    ),
  },
];
