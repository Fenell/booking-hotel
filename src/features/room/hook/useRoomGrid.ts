import type { RoomModel } from "@shared/types/room";
import { useQuery } from "@tanstack/react-query";
import { type ColDef } from "ag-grid-community";

import { useRoomContext } from "../store/RoomContext";
import { useCallback, useMemo } from "react";
import { getPagingRoom } from "../api/room.api";

export const useRoomGrid = () => {
  const { data, isPending } = useQuery({
    queryKey: ["rooms"],
    queryFn: (signal) =>
      getPagingRoom(signal, { pageNumber: 1, pageSize: 100, searchKey: "" }),
  });
  const { isOpen, openDialog } = useRoomContext();

  const handleClickAction = useCallback(
    (id?: string) => {
      openDialog(true);
      // console.log(id);
    },
    [openDialog],
  );

  const colDefs = useMemo<ColDef<RoomModel>[]>(
    () => [
      { field: "roomName", headerName: "Tên phòng", maxWidth: 400 },
      { field: "description", headerName: "Mô tả" },
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
    [],
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: false,
      flex: 1,
    };
  }, []);

  return { colDefs, defaultColDef, data, isPending, isOpen, openDialog };
};
