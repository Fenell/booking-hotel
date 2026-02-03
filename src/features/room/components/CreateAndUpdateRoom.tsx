import { Button } from "@shared/components/UI";
import DragAndDropImage from "@shared/components/UI/Image/DragAndDropImage";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@shared/components/UI/Modal";
import { useRoomContext } from "../store/RoomContext";
import roomStlye from "../style/room.module.css";
import classNames from "classnames";
import {
  Controller,
  FormProvider,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import type { RoomCreateRequest } from "../types/room.type";
import BaseInfoInput from "./BaseInfoInput";
import ServicesInput from "./ServicesInput";
import { useMutation } from "@tanstack/react-query";
import { createRoom } from "../api/room.api";
import type { ResponseApi } from "@shared/types/common";
import { useToast } from "@shared/hooks/useToast";

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

const CreateAndUpdateRoom = () => {
  const methods = useForm<RoomCreateRequest>({ defaultValues });
  const { handleSubmit, reset } = methods;
  const { openDialog } = useRoomContext();
  const toast = useToast();
  const handleSuccess = (response: ResponseApi<string>) => {
    console.log(response);
    if (response.isSuccess) {
      toast.success("Thêm mới thành công");
      reset(defaultValues);
    } else {
      toast.warning("Thêm mới thất bại T_T");
    }
  };

  const { mutate } = useMutation({
    mutationFn: createRoom,
    onSuccess: (data) => handleSuccess(data),
    onError: () => toast.warning("Thêm mới thất bại T_T"),
  });

  const onsubmit: SubmitHandler<RoomCreateRequest> = (data) => {
    console.log(data);
    data.roomNumber = 111;
    mutate(data);
  };

  return (
    <Modal size="lg" onClose={() => openDialog(false)}>
      <ModalHeader title="Thêm mới" />
      <ModalContent>
        <FormProvider {...methods}>
          <form
            id="room-form"
            autoComplete="off"
            style={{ height: "100%" }}
            onSubmit={handleSubmit(onsubmit)}
          >
            <div className={roomStlye.roomForm}>
              <div className={roomStlye.moreInfo}>
                <BaseInfoInput />
                <ServicesInput />
              </div>

              <div>
                <p className={roomStlye.title}>Hình ảnh</p>
                <DragAndDropImage />
              </div>
            </div>
          </form>
        </FormProvider>
      </ModalContent>
      <ModalFooter>
        <Button status="success" noAnimation type="submit" form="room-form">
          Cất giữ
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAndUpdateRoom;
