import type { ResponseApi } from "@shared/types/common";
import { useRoomContext } from "../store/RoomContext";
import type { RoomCreateRequest } from "../types/room.type";
import { useToast } from "@shared/hooks/useToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRoom, getRoomDetail, updateRoom } from "../api/room.api";
import { useEffect, useMemo, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { RoomModel } from "@shared/types/room";
import { type GridApi } from "ag-grid-community";
import { uploadImages } from "@shared/services/image";
import type { FileInput } from "@shared/components/UI/Image/DragAndDropImage";
import type { UploadImageRequest } from "@shared/types/roomImage";

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
  const listImgCreate = useRef<UploadImageRequest>({
    roomCode: "",
    imageFiles: [],
  });

  const handleSuccess = async (response: ResponseApi<string | RoomModel>) => {
    if (response.isSuccess) {
      if (isEdit) {
        toast.success("Cập nhật thành công ^_^");
        girdApi?.applyTransaction({
          update: [response.data as RoomModel],
        });

        if (listImgCreate.current.imageFiles.length > 0)
          await mutateImgAsync(listImgCreate.current).catch(() => {});
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

  const { mutateAsync: mutateImgAsync } = useMutation({
    mutationFn: uploadImages,
    // onSuccess: () => toast.success("Thêm mới thành công ^_^"),
    // onError: () => toast.warning("Có lỗi trong quá trình upload ảnh T_T"),
  });

  const { data, isPending } = useQuery({
    queryKey: ["rooms", id],
    queryFn: ({ signal }) => getRoomDetail({ signal }, id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (!isPending && data) {
      listImgCreate.current.roomCode = data.id;
      reset(data);
    }
  }, [isPending, data, reset]);

  const handleGetImages = (imgs: FileInput[]) => {
    const listImgsCreate = imgs.filter(
      (c) => !data?.roomImages.some((a) => a.id === c.id),
    );

    listImgCreate.current.imageFiles = listImgsCreate
      .map((a) => a.file!)
      .filter(Boolean);
  };

  const onsubmit: SubmitHandler<RoomCreateRequest> = (data) => {
    console.log(data);
    if (isEdit) {
      mutateUpdate(data);
    } else {
      data.roomNumber = 111;
      mutate(data);
    }
  };

  return {
    isEdit,
    methods,
    isPending,
    data,
    openDialog,
    onsubmit,
    handleGetImages,
  };
};
