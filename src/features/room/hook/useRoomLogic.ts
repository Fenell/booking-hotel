import { useToast } from "@shared/hooks/useToast";
import { useRoomContext } from "../context/RoomContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { changeStatus, getPagingRoom } from "../api/room.api";
import type { RoomModel } from "../types/room.type";

export const useRoomLogic = () => {
  const toast = useToast();
  const { isOpen, openDialog } = useRoomContext();

  const { data, isPending } = useQuery({
    queryKey: ["rooms"],
    queryFn: (signal) =>
      getPagingRoom(signal, { pageNumber: 1, pageSize: 100, searchKey: "" }),
  });

  const handleEditRoom = (id: RoomModel["id"]) => {
    // console.log(id);
    openDialog(true, id);
  };

  // const isCallApi = isChagingStt;
  return {
    isOpen,
    data,
    isPending,
    openDialog,
    handleEditRoom,
  };
};
