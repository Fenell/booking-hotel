import { getDynamicData } from "@shared/services/dynamic";
import { useQuery } from "@tanstack/react-query";
import type { ServiceResponse } from "../types/service.type";
import type { DyanmicDataPagingRequest } from "@shared/types/dynamic";
import { type ColDef } from "ag-grid-community";
import { useCallback, useMemo } from "react";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { ActionServiceColProps } from "../components/ActionServiceCol";
import ActionServiceCol from "../components/ActionServiceCol";
import { useServiceContext } from "../store/serviceContext";

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

  const handleClickAction = useCallback(
    (id?: string) => {
      openOrCloseDialog(true, id);
      // console.log(id);
    },
    [openOrCloseDialog],
  );

  const colDefs = useMemo<ColDef<ServiceResponse>[]>(
    () => [
      { field: "serviceCode", headerName: "Tên dịch vụ", maxWidth: 400 },
      { field: "description", headerName: "Mô tả" },
      {
        colId: "action",
        headerName: "Thao tác",
        pinned: "right",
        // type: "rightAligned",
        width: 200,
        cellRenderer: ActionServiceCol,
        cellRendererParams: (
          params: CustomCellRendererProps<ServiceResponse>,
        ): Pick<ActionServiceColProps, "onClick"> => ({
          onClick: () => handleClickAction(params.data?.id),
        }),
      },
    ],
    [handleClickAction],
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: false,
      flex: 1,
    };
  }, []);

  return { colDefs, defaultColDef, data, isPending };
};
