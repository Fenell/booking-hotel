import { useToast } from "@shared/hooks/useToast";
import { useRoomContext } from "../store/RoomContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { changeStatus, getPagingRoom } from "../api/room.api";
import type { RoomModel } from "@shared/types/room";
import { useCallback, useRef } from "react";
import { type GridApi, type GridReadyEvent } from "ag-grid-community";

export const useRoomLogic = () => {
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
        mutate({ id, status: checked ? 1 : 0 });
      }
    },
    [mutate],
  );

  const handleEditRoom = (id: RoomModel["id"]) => {
    console.log(id);
    openDialog(true, id);
  };

  return {
    isOpen,
    data,
    isPending,
    openDialog,
    onGridReady,
    handleToogle,
    handleEditRoom,
  };
};
