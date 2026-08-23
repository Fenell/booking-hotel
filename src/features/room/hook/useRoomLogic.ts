import { useRoomContext } from "../context/RoomContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPagingRoom } from "../api/room.api";
import { roomKeys } from "../api/room.keys";
import type { RoomModel } from "../types/room.type";
import type { PagingResponse } from "@shared/types/dynamic";
import { useCallback } from "react";

export const useRoomLogic = () => {
  const { isOpen, openDialog } = useRoomContext();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: roomKeys.list(),
    queryFn: (signal) =>
      getPagingRoom(signal, { pageNumber: 1, pageSize: 100, searchKey: "" }),
  });

  const handleEditRoom = useCallback(
    (id: RoomModel["id"]) => {
      openDialog(true, id);
    },
    [openDialog],
  );

  /**
   * Ghi bản mới của một phòng vào cache thay vì refetch cả danh sách — lưới đọc
   * thẳng từ cache nên dòng tự cập nhật, không nháy và không mất trang/bộ lọc
   * người dùng đang xem.
   */
  const applyRoomUpdate = useCallback(
    (updated: RoomModel) => {
      queryClient.setQueryData<PagingResponse<RoomModel[]>>(
        roomKeys.list(),
        (prev) =>
          prev
            ? {
                ...prev,
                data: prev.data.map((room) =>
                  room.id === updated.id ? { ...room, ...updated } : room,
                ),
              }
            : prev,
      );
    },
    [queryClient],
  );

  return {
    isOpen,
    data,
    isPending,
    openDialog,
    handleEditRoom,
    applyRoomUpdate,
  };
};
