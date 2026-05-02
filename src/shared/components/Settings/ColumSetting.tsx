import Checkbox from "../UI/Checkbox/Checkbox";

import type { ChangeEvent, RefObject } from "react";
import { loadCol, updateConfigGrid } from "@shared/services/configGridSetting";
import type {
  GridColumnModel,
  GridComponent,
} from "@syncfusion/ej2-react-grids";

export type ColumnSettingProps = {
  girdKey: string;
  onChangeCol?: (cols: GridColumnModel[]) => void;
  gridRef?: RefObject<GridComponent | null>;
};

export const ColumnSetting = ({
  girdKey,
  onChangeCol,
  gridRef,
}: ColumnSettingProps) => {
  const colDefs = loadCol(girdKey);

  const handleCheckSetting = (
    e: ChangeEvent<HTMLInputElement>,
    field: string,
  ): void => {
    const newCols = updateConfigGrid(girdKey, colDefs, field);
    onChangeCol?.(newCols);
    if (e.target.checked) {
      gridRef?.current?.showColumns(field, "field");
    } else {
      gridRef?.current?.hideColumns(field, "field");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
        width: "350px",
        padding: "6px",
      }}
    >
      {colDefs.map((c) => (
        <Checkbox
          key={c.field}
          index={c.field}
          isChecked={c?.visible ?? true}
          label={c.headerText ?? ""}
          onChecked={(e) => handleCheckSetting(e, c.field?.toString() ?? "")}
          style={{ flex: "0 0 160px" }}
        />
      ))}
    </div>
  );
};
