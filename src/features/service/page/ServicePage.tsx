import { getDynamicData } from "@shared/services/dynamic";
import type { DyanmicDataPagingRequest } from "@shared/types/dynamic";
import { useQuery } from "@tanstack/react-query";
import type { ServiceResponse } from "../types/service.type";
import { useMemo, useState } from "react";
import { AgGridReact, type CustomCellRendererProps } from "ag-grid-react";
import { type AutoSizeStrategy, type ColDef } from "ag-grid-community";
import ActionServiceCol, {
  type ActionServiceColProps,
} from "../components/ActionServiceCol";

const serviceRequest: DyanmicDataPagingRequest = {
  tableNames: "view_service_with_icon",
  pageSize: 100,
  pageNumber: 1,
};

const ServicePage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["services"],
    queryFn: () => getDynamicData<ServiceResponse[]>(serviceRequest),
  });

  const handleClickAction = (id?: string) => {
    console.log(id);
  };

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
    [],
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: false,
      flex: 1,
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        loading={isPending}
        columnDefs={colDefs}
        rowData={data?.data}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};

export default ServicePage;
