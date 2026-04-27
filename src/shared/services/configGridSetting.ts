import type { ColumnDef } from "@shared/components/DataGrid";
import {
  defaultRoomConfig,
  defaultServiceConfig,
} from "@shared/types/gridConfig";
import { formatNumber } from "@shared/utils/formatNumber";

export const loadConfigGrid = <T>(config: string) => {
  const configData = localStorage.getItem(config);
  if (!configData) {
    switch (config) {
      case "service": {
        const jsonData = JSON.stringify(defaultServiceConfig);
        localStorage.setItem(config, jsonData);
        console.log("load default");
        addFormatNumber(defaultServiceConfig);
        return defaultServiceConfig;
      }
      case "room": {
        const jsonData1 = JSON.stringify(defaultRoomConfig);
        localStorage.setItem(config, jsonData1);
        console.log("load default");
        addFormatNumber(defaultRoomConfig);
        return defaultRoomConfig;
      }
      default:
        throw new Error("Grid key not config");
    }
  }
  const configObj: ColumnDef<T>[] = configData ? JSON.parse(configData) : [];
  console.log("load local");
  const colNew = addFormatNumber(configObj);

  return colNew;
};

export const loadCol = <T>(configKey: string) => {
  const configData = localStorage.getItem(configKey);
  const configObj: ColumnDef<T>[] = configData ? JSON.parse(configData) : [];

  return configObj;
};

export const updateConfigGrid = <T>(
  girdKey: string,
  colDefs: ColumnDef<T>[],
  field: string | undefined,
) => {
  const newCols = colDefs.map((col) => {
    if (col.field === field) {
      return { ...col, hide: !col.hide };
    }
    return col;
  });

  localStorage.setItem(girdKey, JSON.stringify(newCols));

  return addFormatNumber(newCols);
};

export const addFormatNumber = <T>(cols: ColumnDef<T>[]) => {
  const newCols = cols.map((col) => {
    if (col.type === "numericColumn") {
      return { ...col, valueFormatter: (value) => formatNumber(value) };
    }
    return col;
  });
  return newCols;
};
