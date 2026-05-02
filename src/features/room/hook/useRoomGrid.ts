import { useMemo, useState } from "react";
import { loadConfigGrid } from "@shared/services/configGridSetting";

import type {
  GridColumnModel,
  PageSettingsModel,
} from "@syncfusion/ej2-react-grids";

type UseRoomGridProps = {
  onEditRoom: (id: string) => void;
};

export const useRoomGrid = ({ onEditRoom }: UseRoomGridProps) => {
  const [colConfig, setColConfig] = useState(() => loadConfigGrid("room"));

  const handleUpdateColDef = (newCols: GridColumnModel[]) => {
    // console.log(newCols);
    setColConfig(newCols);
  };

  const pageOptions = useMemo<PageSettingsModel>(() => {
    return { pageSize: 20, pageSizes: [20, 50, "All"] };
  }, []);

  // const colAction = useMemo<ColumnDef<RoomModel>>(
  //   () => ({
  //     colId: "action",
  //     headerName: "Thao tác",
  //     pinned: "right",
  //     // type: "rightAligned",
  //     width: 200,
  //     cellRenderer: GridRowAction,
  //     cellRendererParams: ({
  //       data,
  //     }: CustomCellRendererProps<RoomModel>): Pick<
  //       ActionCellRendererProps<RoomModel>,
  //       "actions" | "onEdit" | "data"
  //     > => ({
  //       onEdit: (data) => onEditRoom(data.id),
  //       actions: ["edit"],
  //       data: data,
  //     }),
  //   }),
  //   [onEditRoom],
  // );

  // const colStatus = useMemo<ColumnDef<RoomModel>>(
  //   () => ({
  //     field: "status",
  //     headerName: "Trạng thái",
  //     cellComponent: StatusSwitch,
  //     cellProps: ({
  //       row: data,
  //     }: DataGridCellComponentProps<RoomModel>): Pick<
  //       StatusSwitchProp,
  //       "onToggle" | "isLoading"
  //     > => ({
  //       onToggle: (e) => onToogleStatus(e, data?.id),
  //       isLoading: isProcessingUpdateStt,
  //     }),
  //     width: 100,
  //   }),
  //   [isProcessingUpdateStt, onToogleStatus],
  // );

  // const defaultColDef = useMemo<ColDef>(() => {
  //   return {
  //     editable: false,
  //     flex: 1,
  //   };
  // }, []);

  return {
    // defaultColDef,

    colConfig,
    setColConfig: handleUpdateColDef,
    pageOptions,
  };
};
