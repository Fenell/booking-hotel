import type { ResponseApi } from "@shared/types/common";
import { useRoomContext } from "../store/RoomContext";
import type { RoomCreateRequest } from "../types/room.type";
import { useToast } from "@shared/hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRoom, getRoomDetail, updateRoom } from "../api/room.api";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { RoomModel } from "@shared/types/room";
import { type GridApi } from "ag-grid-community";
import { uploadImages } from "@shared/services/image";

const defaultValues: RoomCreateRequest = {
  roomName: "",
  roomNumber: null,
  currentPrice: null,
  priceWeekend: null,
  numberAdults: null,
  numberBathRoom: null,
  numberBed: null,
  numberBedroom: null,
  numberChild: null,
  acreage: null,
  location: "",
  status: 1,
  roomServices: [],
};

export const useRoomForm = (girdApi?: GridApi<RoomModel>) => {
  const methods = useForm<RoomCreateRequest>({ defaultValues });
  const { openDialog, id } = useRoomContext();
  const toast = useToast();
  const { reset } = methods;
  const isEdit: boolean = Boolean(id);
  const handleSuccess = (response: ResponseApi<string | RoomModel>) => {
    console.log(response);
    if (response.isSuccess) {
      if (isEdit) {
        toast.success("Cập nhật thành công ^_^");
        girdApi?.applyTransaction({
          update: [response.data as RoomModel],
        });
      } else {
        toast.success("Thêm mới thành công ^_^");
        reset(defaultValues);
      }
      openDialog(false);
    } else {
      toast.warning("Thêm mới thất bại T_T");
    }
  };

  const { mutate } = useMutation({
    mutationFn: createRoom,
    onSuccess: (data) => handleSuccess(data),
    onError: () => toast.warning("Thêm mới thất bại T_T"),
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: updateRoom,
    onSuccess: (data) => handleSuccess(data),
    onError: () => toast.warning("Cập nhật thất bại T_T"),
  });

  const { mutate: mutateImg } = useMutation({
    mutationFn: uploadImages,
    onSuccess: () => toast.success("Thêm mới thành công ^_^"),
    onError: () => toast.warning("Thêm mới thất bại T_T"),
  });

  const { data, isPending } = useQuery({
    queryKey: ["rooms", id],
    queryFn: ({ signal }) => getRoomDetail({ signal }, id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (!isPending && data) {
      reset(data);
    }
  }, [isPending, data, reset]);

  const onsubmit: SubmitHandler<RoomCreateRequest> = (data) => {
    console.log(data);
    if (isEdit) {
      // mutateUpdate(data);
    } else {
      data.roomNumber = 111;
      mutate(data);
    }
  };

  return { isEdit, methods, isPending, data, openDialog, onsubmit };
};
