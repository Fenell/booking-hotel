import type { ColumnDef } from "@shared/components/DataGrid";
import type { ServiceResponse } from "../types/service.type";
import ActionServiceCol from "./ActionServiceCol";

export const createServiceCol = (
  actionClick: (id: string) => void,
): ColumnDef<ServiceResponse>[] => [
  {
    field: "serviceCode",
    headerName: "Tên dịch vụ",
    width: 500,
    sortable: true,
  },
  { field: "description", headerName: "Mô tả", width: 860 },
  {
    field: "actions",
    headerName: "Thao tác",
    pinned: "right",
    // type: "rightAligned",

    cell: (row) => <ActionServiceCol row={row} onClick={actionClick} />,
  },
];

// export default CreateServiceCol;
