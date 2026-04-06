import type { RoomModel } from "@shared/types/room";
import { type ColDef } from "ag-grid-community";

import { useMemo, useState } from "react";
import { formatNumber } from "@shared/utils/formatNumber";
import StatusSwitch, {
  type StatusSwitchProp,
} from "../components/StatusSwitch";
import type { CustomCellRendererProps } from "ag-grid-react";
import GridRowAction, {
  type ActionCellRendererProps,
} from "@shared/components/UI/GridRowAction/GridRowAction";
import { useLoadConfigGrid } from "@shared/hooks/useLoadConfigGrid";
import { loadConfigGrid } from "@shared/services/configGridSetting";

type UseRoomGridProps = {
  onToogleStatus: (checked: boolean, id?: string) => void;
  onEditRoom: (id: string) => void;
  isProcessingUpdateStt: boolean;
};

export const useRoomGrid = ({
  onToogleStatus,
  onEditRoom,
  isProcessingUpdateStt,
}: UseRoomGridProps) => {
  const [colConfig, setColConfig] = useState(() =>
    loadConfigGrid<RoomModel>("room"),
  );

  const handleUpdateColDef = (newCols: ColDef[]) => {
    setColConfig(newCols);
  };

  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [50, 100, 200];
  }, []);

  // const { colDefs: colConfig, isReady } = useLoadConfigGrid("room");
  const colStatus = useMemo<ColDef<RoomModel>>(
    () => ({
      field: "status",
      headerName: "Trạng thái",
      cellClass: "ag-center-aligned-cell",
      headerClass: "ag-center-aligned-header",
      cellRenderer: StatusSwitch,
      cellRendererParams: ({
        data,
      }: CustomCellRendererProps<RoomModel>): Pick<
        StatusSwitchProp,
        "onToggle" | "isLoading"
      > => ({
        onToggle: (e) => onToogleStatus(e, data?.id),
        isLoading: isProcessingUpdateStt,
      }),
      width: 100,
    }),
    [isProcessingUpdateStt, onToogleStatus],
  );

  const colAction = useMemo<ColDef<RoomModel>>(
    () => ({
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
    }),
    [onEditRoom],
  );

  const colDefs = useMemo(
    () => [...colConfig, colStatus, colAction],
    [colAction, colConfig, colStatus],
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
    setColConfig: handleUpdateColDef,
  };
};
