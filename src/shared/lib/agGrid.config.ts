import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type Theme,
} from "ag-grid-community";
import { useMemo } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

export const useGridTheme = () => {
  const myTheme = themeQuartz.withParams({
    columnBorder: false,
    headerRowBorder: true,
    rowBorder: true,
    wrapperBorder: false,
  });

  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);

  return theme;
};
