import {
  defaultRoomConfig,
  defaultServiceConfig,
} from "@shared/types/gridConfig";

import type { GridColumnModel } from "@syncfusion/ej2-react-grids";

export const loadConfigGrid = (config: string) => {
  const configData = localStorage.getItem(config);
  if (!configData) {
    switch (config) {
      case "service": {
        const jsonData = JSON.stringify(defaultServiceConfig);
        localStorage.setItem(config, jsonData);
        console.log("load default");
        // addFormatNumber(defaultServiceConfig);
        return defaultServiceConfig;
      }
      case "room": {
        const jsonData1 = JSON.stringify(defaultRoomConfig);
        localStorage.setItem(config, jsonData1);
        console.log("load default");
        // addFormatNumber(defaultRoomConfig);
        return defaultRoomConfig;
      }
      default:
        throw new Error("Grid key not config");
    }
  }
  const configObj: GridColumnModel[] = configData ? JSON.parse(configData) : [];
  console.log("load local");
  // const colNew = addFormatNumber(configObj);

  return configObj;
};

export const loadCol = (configKey: string) => {
  const configData = localStorage.getItem(configKey);
  const configObj: GridColumnModel[] = configData ? JSON.parse(configData) : [];
  return configObj.filter((c) => c.field !== "id");
};

export const updateConfigGrid = (
  girdKey: string,
  colDefs: GridColumnModel[],
  field: string | undefined,
) => {
  const newCols = colDefs.map((col) => {
    if (col.field === field) {
      return { ...col, visible: !col.visible };
    }
    return col;
  });

  localStorage.setItem(girdKey, JSON.stringify(newCols));

  // return addFormatNumber(newCols);
  return newCols;
};

// export const addFormatNumber = <T>(cols: ColumnDef<T>[]) => {
//   const newCols = cols.map((col) => {
//     if (col.type === "numericColumn") {
//       return { ...col, valueFormatter: (value) => formatNumber(value) };
//     }
//     return col;
//   });

// return newCols;
// };
