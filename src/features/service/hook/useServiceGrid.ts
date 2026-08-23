import { getDynamicData } from "@shared/services/dynamic";
import { useQuery } from "@tanstack/react-query";
import type { ServiceResponse } from "../types/service.type";
import type { DynamicDataPagingRequest } from "@shared/types/dynamic";
import { useCallback, useMemo, useState } from "react";
import { useServiceContext } from "../context/ServiceContext";
import { loadConfigGrid } from "@shared/services/configGridSetting";
import { serviceKeys } from "../api/service.keys";
import type { GridColumnModel } from "@syncfusion/ej2-react-grids";

const serviceRequest: DynamicDataPagingRequest = {
  tableNames: "view_service_with_icon",
  pageSize: 100,
  pageNumber: 1,
};

export const useServiceGrid = () => {
  const { data, isPending } = useQuery({
    queryKey: serviceKeys.grid(),
    queryFn: () => getDynamicData<ServiceResponse[]>(serviceRequest),
  });
  const { openOrCloseDialog } = useServiceContext();

  const [colConfig, setColConfig] = useState(
    () => loadConfigGrid("service") as GridColumnModel[],
  );

  const handleUpdateColDef = (newCols: GridColumnModel[]) => {
    setColConfig(newCols);
  };

  const pageOptions = useMemo(() => {
    return {
      pageSize: 20,
      pageSizes: [20, 50, "All"],
    };
  }, []);

  // const handleClickAction = useCallback(
  //   (id?: string) => {
  //     openOrCloseDialog(true, id);
  //     // console.log(id);
  //   },
  //   [openOrCloseDialog],
  // );

  const handleClickAction = useCallback(
    (id?: string) => {
      openOrCloseDialog(true, id);
    },
    [openOrCloseDialog],
  );

  // const actionCol = useMemo<GridColumnModel>(
  //   () => ({
  //     field: "actions",
  //     headerName: "Thao tác",
  //     pinned: "right",
  //     // type: "rightAligned",
  //     width: 120,
  //     cellComponent: ActionServiceCol,
  //     cellProps: ({
  //       row: data,
  //     }: DataGridCellComponentProps<ServiceResponse>): Pick<
  //       ActionCellRendererProps<ServiceResponse>,
  //       "onClick"
  //     > => ({
  //       onClick: () => handleClickAction(data?.id),
  //     }),
  //   }),
  //   [handleClickAction],
  // );

  // const colDefs = useMemo(() => {
  //   return [...colConfig, actionCol];
  // }, [colConfig, actionCol]);

  // const defaultColDef = useMemo<ColDef>(() => {
  //   return {
  //     editable: false,
  //     flex: 1,
  //   };
  // }, []);

  return {
    colConfig,
    pageOptions,
    data,
    isPending,
    setColConfig: handleUpdateColDef,
  };
};
