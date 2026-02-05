import type { RoomModel } from "@shared/types/room";
import { type ColDef } from "ag-grid-community";

import { useMemo } from "react";
import { formatNumber } from "@shared/utils/formatNumber";
import StatusSwitch, {
  type StatusSwitchProp,
} from "../components/StatusSwitch";
import type { CustomCellRendererProps } from "ag-grid-react";
import GridRowAction, {
  type ActionCellRendererProps,
} from "@shared/components/UI/GridRowAction/GridRowAction";

type UseRoomGridProps = {
  onToogleStatus: (checked: boolean, id?: string) => void;
  onEditRoom: (id: string) => void;
};

export const useRoomGrid = ({
  onToogleStatus,
  onEditRoom,
}: UseRoomGridProps) => {
  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [50, 100, 200];
  }, []);

  const colDefs = useMemo<ColDef<RoomModel>[]>(
    () => [
      { field: "roomName", headerName: "Tên phòng", maxWidth: 500, width: 400 },
      {
        field: "currentPrice",
        headerName: "Giá phòng",
        type: "numericColumn",
        valueFormatter: (e) => formatNumber(e.value),
      },
      {
        field: "priceWeekend",
        headerName: "Giá cuối tuần",
        type: "numericColumn",
        valueFormatter: (e) => formatNumber(e.value),
      },

      {
        field: "status",
        headerName: "Trạng thái",
        cellClass: "ag-center-aligned-cell",
        headerClass: "ag-center-aligned-header",
        cellRenderer: StatusSwitch,
        cellRendererParams: ({
          data,
        }: CustomCellRendererProps<RoomModel>): Pick<
          StatusSwitchProp,
          "onToggle"
        > => ({
          onToggle: (e) => onToogleStatus(e, data?.id),
        }),
        width: 100,
      },
      {
        colId: "action",
        headerName: "Thao tác",
        pinned: "right",
        // type: "rightAligned",
        width: 200,
        cellRenderer: GridRowAction,
        cellRendererParams: ({
          data,
        }: CustomCellRendererProps<RoomModel>): Pick<
          ActionCellRendererProps<RoomModel>,
          "actions" | "onEdit" | "data"
        > => ({
          onEdit: (data) => onEditRoom(data.id),
          actions: ["edit"],
          data: data,
        }),
      },
    ],
    [onEditRoom, onToogleStatus],
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: false,
      flex: 1,
    };
  }, []);

  return {
    colDefs,
    defaultColDef,
    paginationPageSizeSelector,
  };
};
