import type { ColumnDef } from "@shared/components/DataGrid";
import GridRowAction from "@shared/components/UI/GridRowAction/GridRowAction";
import { SERVICE_KIND_LABEL, type ServiceResponse } from "../types/service.type";

type CreateServiceColOptions = {
  onEdit: (id: string) => void;
};

/**
 * Cột của lưới Dịch vụ (đọc từ view `view_service_with_icon`).
 *
 * Lưới chạy server-side nên `field` phải chuyển được sang tên cột thật của view:
 * mọi field ở đây đều đúng quy tắc camelCase → snake_case, không cần `serverField`.
 * Cấu hình cột (thứ tự, ẩn/hiện, độ rộng) do chính DataGrid lưu vào localStorage
 * qua prop `gridKey`.
 */
const createServiceCol = ({
  onEdit,
}: CreateServiceColOptions): ColumnDef<ServiceResponse>[] => [
  {
    field: "serviceCode",
    headerText: "Mã dịch vụ",
    width: 140,
    visible: false,
    filter: { type: "text" },
  },
  {
    field: "serviceName",
    headerText: "Tên dịch vụ",
    width: 260,
    minWidth: 180,
    pinned: "left",
    filter: { type: "text" },
  },
  {
    field: "nameTypeService",
    headerText: "Nhóm",
    width: 160,
    filter: { type: "text" },
  },
  {
    // Bản chất hành xử (Tiện nghi / Hàng hóa / Dịch vụ) — cột lưu số nên cố ý
    // không mở ô lọc: người dùng không phải nhớ 0/1/2 là gì.
    field: "kind",
    headerText: "Loại",
    width: 120,
    cell: (row) => SERVICE_KIND_LABEL[row.kind] ?? "—",
  },
  {
    field: "price",
    headerText: "Giá dịch vụ",
    width: 150,
    align: "right",
    format: "N0",
    filter: { type: "number" },
  },
  {
    field: "unit",
    headerText: "Đơn vị",
    width: 110,
    visible: false,
    filter: { type: "text" },
  },
  {
    field: "description",
    headerText: "Ghi chú",
    width: 240,
    filter: { type: "text" },
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

export default createServiceCol;
