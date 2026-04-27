import type { ColumnDef } from "@shared/components/DataGrid";
import GridRowAction from "@shared/components/UI/GridRowAction/GridRowAction";
import Switch from "@shared/components/UI/Switch/Switch";
import { loadConfigGrid } from "@shared/services/configGridSetting";
import type { RoomModel } from "@shared/types/room";

const createRoomCol = (
  isLoading: boolean,
  onEdit: (row: unknown) => void,
  onToggle: (checked: boolean, id: string) => void,
): ColumnDef<RoomModel>[] => {
  const colConfig = loadConfigGrid<RoomModel>("room") as ColumnDef<RoomModel>[];
  colConfig.forEach((col) => {
    if (col.field === "actions") {
      col.cell = (row) => (
        <GridRowAction data={row} actions={["edit"]} onEdit={onEdit} />
      );
    } else if (col.field === "status") {
      col.cell = (row) => {
        const checked: boolean = row.status === 1;
        return (
          <Switch
            checked={checked}
            onToggle={(e) => onToggle(e, row.id)}
            isLoading={isLoading}
          />
        );
      };
    }
  });

  // const colAction = colConfig.find((c) => c.field === "actions");
  // if (colAction) {
  //   colAction.cell = (row) => (
  //     <GridRowAction data={row} actions={["edit"]} onEdit={onEdit} />
  //   );
  // }

  return colConfig;
};

export default createRoomCol;
