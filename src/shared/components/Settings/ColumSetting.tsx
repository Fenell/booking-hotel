import Checkbox from "../UI/Checkbox/Checkbox";
import { type ColDef } from "ag-grid-community";

import type { ChangeEvent } from "react";
import { loadCol, updateConfigGrid } from "@shared/services/configGridSetting";
import type { ColumnDef, GridRow } from "../DataGrid";

export type ColumnSettingProps<T extends GridRow> = {
  girdKey: string;
  onChangeCol: (cols: ColumnDef<T>[]) => void;
};

export const ColumnSetting = <T,>({
  girdKey,
  onChangeCol,
}: ColumnSettingProps<T>) => {
  const colDefs = loadCol<T>(girdKey);

  const handleCheckSetting = (
    e: ChangeEvent<HTMLInputElement>,
    field: string,
  ): void => {
    const newCols = updateConfigGrid<T>(girdKey, colDefs, field);
    onChangeCol?.(newCols);
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
          isChecked={!c.hide}
          label={c.headerName ?? ""}
          onChecked={(e) => handleCheckSetting(e, c.field?.toString() ?? "")}
          style={{ flex: "0 0 160px" }}
        />
      ))}
    </div>
  );
};
