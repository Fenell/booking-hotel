import { getDynamicData } from "@shared/services/dynamic";
import { useQuery } from "@tanstack/react-query";
import type { ServiceResponse } from "../types/service.type";
import type { DyanmicDataPagingRequest } from "@shared/types/dynamic";
import { type ColDef } from "ag-grid-community";
import { useCallback, useMemo } from "react";
import { useServiceContext } from "../store/serviceContext";
import { useLoadConfigGrid } from "@shared/hooks/useLoadConfigGrid";
import type { ColumnDef } from "@shared/components/DataGrid";
import { createServiceCol } from "../components/createServiceColumns";
const serviceRequest: DyanmicDataPagingRequest = {
  tableNames: "view_service_with_icon",
  pageSize: 100,
  pageNumber: 1,
};

export const useGridService = () => {
  const { data, isPending } = useQuery({
    queryKey: ["services"],
    queryFn: () => getDynamicData<ServiceResponse[]>(serviceRequest),
  });
  const { openOrCloseDialog } = useServiceContext();

  // const handleClickAction = useCallback(
  //   (id?: string) => {
  //     openOrCloseDialog(true, id);
  //     // console.log(id);
  //   },
  //   [openOrCloseDialog],
  // );

  const handleClickAction = (id?: string) => {
    openOrCloseDialog(true, id);
  };

  const colDefs = createServiceCol(handleClickAction);
  // const colDefs = useMemo<ColumnDef<ServiceResponse>[]>(
  //   () => createServiceCol(handleClickAction),
  //   [handleClickAction],
  // );

  // const { colDefs: colDefsConfig } =
  //   useLoadConfigGrid<ServiceResponse>("service");

  // const customeCol = useMemo<ColDef<ServiceResponse>>(
  //   () => ({
  //     colId: "action",
  //     headerName: "Thao tác",
  //     pinned: "right",
  //     // type: "rightAligned",
  //     width: 200,
  //     cellRenderer: ActionServiceCol,
  //     cellRendererParams: (
  //       params: CustomCellRendererProps<ServiceResponse>,
  //     ): Pick<ActionServiceColProps, "onClick"> => ({
  //       onClick: () => handleClickAction(params.data?.id),
  //     }),
  //   }),
  //   [handleClickAction],
  // );

  // const colDefs = useMemo(() => {
  //   return [...colDefsConfig, customeCol];
  // }, [colDefsConfig, customeCol]);

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: false,
      flex: 1,
    };
  }, []);

  return { colDefs, defaultColDef, data, isPending };
};
