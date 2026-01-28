import Spinner from "@shared/components/Spinner/Spinner";
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

const CreateAndUpdateRoom = () => {
  const methods = useForm<RoomCreateRequest>();
  const { control, reset, handleSubmit } = methods;
  const { openDialog } = useRoomContext();

  const onsubmit: SubmitHandler<RoomCreateRequest> = (data) => {
    console.log(data);
  };

  return (
    <Modal size="lg" onClose={() => openDialog(false)}>
      <ModalHeader title="Thêm mới" />
      <ModalContent>
        <FormProvider {...methods}>
          <form
            id="room-form"
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
