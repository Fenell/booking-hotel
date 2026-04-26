import type { ColumnDef } from "@shared/components/DataGrid";
import type { ServiceResponse } from "../types/service.type";
import ActionServiceCol from "./ActionServiceCol";

export const createServiceCol = (
  actionClick: (id: string) => void,
): ColumnDef<ServiceResponse>[] => [
  { id: "serviceCode", label: "Tên dịch vụ", width: 500 },
  { id: "description", label: "Mô tả", width: 710 },
  {
    id: "actions",
    label: "Thao tác",
    pinned: "right",
    // type: "rightAligned",

    cell: (row) => <ActionServiceCol row={row} onClick={actionClick} />,
  },
];

// export default CreateServiceCol;
