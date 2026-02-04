import type { RoomModel } from "@shared/types/room";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  type ColDef,
  type GridApi,
  type GridReadyEvent,
} from "ag-grid-community";

import { useRoomContext } from "../store/RoomContext";
import { useCallback, useMemo, useRef } from "react";
import { changeStatus, getPagingRoom } from "../api/room.api";
import { formatNumber } from "@shared/utils/formatNumber";
import StatusSwitch, {
  type StatusSwitchProp,
} from "../components/StatusSwitch";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useToast } from "@shared/hooks/useToast";

export const useRoomGrid = () => {
  const toast = useToast();
  const { isOpen, openDialog } = useRoomContext();
  const { data, isPending } = useQuery({
    queryKey: ["rooms"],
    queryFn: (signal) =>
      getPagingRoom(signal, { pageNumber: 1, pageSize: 100, searchKey: "" }),
  });

  const gridApiRef = useRef<GridApi<RoomModel> | null>(null);

  const onGridReady = (params: GridReadyEvent) => {
    gridApiRef.current = params.api;
  };

  const handleChangeStatusSuccess = (data: RoomModel) => {
    toast.success("Đổi trạng thái thành công ^_^");
    gridApiRef.current?.applyTransaction({
      update: [data],
    });
  };

  const { mutate } = useMutation({
    mutationFn: changeStatus,
    onSuccess: (data) => handleChangeStatusSuccess(data),
    onError: () => toast.success("Đổi trạng thái không thành công T_T"),
  });

  const handleToogle = useCallback(
    (checked: boolean, id?: string) => {
      console.log(checked);
      if (id) {
        mutate({ id, status: checked ? 0 : 1 });
      }
    },
    [mutate],
  );

  const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
    return [50, 100, 200];
  }, []);

  const colDefs = useMemo<ColDef<RoomModel>[]>(
    () => [
      { field: "roomName", headerName: "Tên phòng", maxWidth: 500, width: 400 },
      {
        field: "currentPrice",
        headerName: "Giá phòng",
        type: "numericColumn",
        valueFormatter: (e) => formatNumber(e.value),
      },
      {
        field: "priceWeekend",
        headerName: "Giá cuối tuần",
        type: "numericColumn",
        valueFormatter: (e) => formatNumber(e.value),
      },
      //      {
      //   field: "crea. ",
      //   headerName: "Thời gian tạo",
      //   type: "numericColumn",
      //   valueFormatter: (e) => formatNumber(e.value),
      // },
      {
        field: "status",
        headerName: "Trạng thái",
        cellClass: "ag-center-aligned-cell",
        headerClass: "ag-center-aligned-header",
        cellRenderer: StatusSwitch,
        cellRendererParams: ({
          data,
        }: CustomCellRendererProps<RoomModel>): Pick<
          StatusSwitchProp,
          "onToggle"
        > => ({
          onToggle: (e) => handleToogle(e, data?.id),
        }),
        width: 100,
      },
      {
        colId: "action",
        headerName: "Thao tác",
        pinned: "right",
        // type: "rightAligned",
        width: 200,
        // cellRenderer: ActionServiceCol,
        // cellRendererParams: (
        //   params: CustomCellRendererProps<ServiceResponse>,
        // ): Pick<ActionServiceColProps, "onClick"> => ({
        //   onClick: () => handleClickAction(params.data?.id),
        // }),
      },
    ],
    [handleToogle],
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: false,
      flex: 1,
    };
  }, []);

  return {
    colDefs,
    defaultColDef,
    data,
    isPending,
    isOpen,
    openDialog,
    gridApiRef,
    onGridReady,
    paginationPageSizeSelector,
  };
};
