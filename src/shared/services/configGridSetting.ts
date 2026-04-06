import {
  defaultRoomConfig,
  defaultServiceConfig,
} from "@shared/types/gridConfig";
import { formatNumber } from "@shared/utils/formatNumber";
import { type ColDef } from "ag-grid-community";

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
  const configObj: ColDef<T>[] = configData ? JSON.parse(configData) : [];
  console.log("load local");

  return addFormatNumber(configObj);
};

export const loadCol = <T>(configKey: string) => {
  const configData = localStorage.getItem(configKey);
  const configObj: ColDef<T>[] = configData ? JSON.parse(configData) : [];

  return configObj;
};

export const updateConfigGrid = <T>(
  girdKey: string,
  colDefs: ColDef<T>[],
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

export const addFormatNumber = <T>(cols: ColDef<T>[]) => {
  const newCols = cols.map((col) => {
    if (col.type === "numericColumn") {
      return { ...col, valueFormatter: (e) => formatNumber(e.value) };
    }
    return col;
  });
  return newCols;
};
