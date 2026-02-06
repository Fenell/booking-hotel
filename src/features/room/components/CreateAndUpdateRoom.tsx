import { Button } from "@shared/components/UI";
import DragAndDropImage, {
  type FileInput,
} from "@shared/components/UI/Image/DragAndDropImage";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRoom, getRoomDetail } from "../api/room.api";
import type { ResponseApi } from "@shared/types/common";
import { useToast } from "@shared/hooks/useToast";
import Spinner from "@shared/components/Spinner/Spinner";
import { useEffect, useState } from "react";
import Tab from "@shared/components/Tab/Tab";
import TabHeader from "@shared/components/Tab/TabHeader";
import {
  TabContent,
  TabContentItem,
  TabHeaderItem,
} from "@shared/components/Tab";
import Editor from "@shared/components/UI/RichText/RichText";

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
  const { openDialog, id } = useRoomContext();
  const toast = useToast();
  const [images, setImages] = useState<FileInput[]>([]);
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

  const { data, isPending } = useQuery({
    queryKey: ["rooms", id],
    queryFn: ({ signal }) => getRoomDetail({ signal }, id),
    enabled: !!id,
  });

  useEffect(() => {
    if (!isPending && data) {
      reset(data);
      const imgs: FileInput[] = data.roomImages.map((image) => ({ ...image }));
      setImages(imgs);
    }
  }, [isPending, data, reset]);

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
          {!!id && isPending ? (
            <Spinner />
          ) : (
            <form
              id="room-form"
              autoComplete="off"
              style={{ height: "100%" }}
              onSubmit={handleSubmit(onsubmit)}
            >
              <div className={roomStlye.roomForm}>
                <Tab>
                  <TabHeader>
                    <TabHeaderItem idTab="1" title="Thông tin" selectDefault />
                    <TabHeaderItem idTab="2" title="Hình ảnh, mô tả" />
                  </TabHeader>
                  <TabContent>
                    <TabContentItem idTab="1">
                      <div className={roomStlye.moreInfo}>
                        <BaseInfoInput />
                        <ServicesInput />
                      </div>
                    </TabContentItem>
                    <TabContentItem idTab="2">
                      <div>
                        <DragAndDropImage images={images} />
                        <div
                          className={classNames(
                            roomStlye.fullField,
                            roomStlye.inputField,
                          )}
                        >
                          <label htmlFor="description">Mô tả</label>
                          <Editor key="description" />
                        </div>
                      </div>
                    </TabContentItem>
                  </TabContent>
                </Tab>
              </div>
            </form>
          )}
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
