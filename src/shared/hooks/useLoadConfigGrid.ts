import {
  defaultRoomConfig,
  defaultServiceConfig,
} from "@shared/types/gridConfig";
import { type ColDef } from "ag-grid-community";
import { useMemo } from "react";

export const useLoadConfigGrid = <T>(config: string) => {
  const colDefs = useMemo(() => {
    const configData = localStorage.getItem(config);
    if (!configData) {
      switch (config) {
        case "service": {
          const jsonData = JSON.stringify(defaultServiceConfig);
          localStorage.setItem(config, jsonData);
          console.log("load default");
          return defaultServiceConfig;
        }
        case "room": {
          const jsonData1 = JSON.stringify(defaultRoomConfig);
          localStorage.setItem(config, jsonData1);
          console.log("load default");
          return defaultRoomConfig;
        }

        default:
          break;
      }
    }
    const configObj: ColDef<T>[] = configData ? JSON.parse(configData) : [];

    return configObj;
  }, [config]);
  const isReady = colDefs.length > 0;

  return { colDefs, isReady };
};
