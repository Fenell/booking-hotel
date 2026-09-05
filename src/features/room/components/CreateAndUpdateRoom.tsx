import { Button } from "@shared/components/UI";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@shared/components/UI/Modal";
import roomStlye from "../style/room.module.css";
import { FormProvider } from "react-hook-form";
import BaseInfoInput from "./BaseInfoInput";
import ServicesInput from "./ServicesInput";
import Spinner from "@shared/components/Spinner/Spinner";
import Tab from "@shared/components/Tab/Tab";
import TabHeader from "@shared/components/Tab/TabHeader";
import {
  TabContent,
  TabContentItem,
  TabHeaderItem,
} from "@shared/components/Tab";
import MoreInfoInput from "./MoreInfoInput";
import { useRoomForm } from "../hook/useRoomForm";

import RoomLocation from "./RoomLocation";
import { useState } from "react";
import type { RoomModel } from "../types/room.type";

type CreateAndUpdateRoomProps = {
  onSuccess: (data: RoomModel) => void;
};

const CreateAndUpdateRoom = ({ onSuccess }: CreateAndUpdateRoomProps) => {
  const {
    isEdit,
    methods,
    isPending,
    isProcessing,
    data,
    openDialog,
    onsubmit,
    handleGetImages,
  } = useRoomForm(onSuccess);
  const { handleSubmit } = methods;

  const title = isEdit ? "Chỉnh sửa thông tin phòng" : "Thêm mới";
  const [activeTab, setActiveTab] = useState("1");
  return (
    <Modal size="xs" onClose={() => openDialog(false)}>
      <ModalHeader title={title} />
      <ModalContent>
        <FormProvider {...methods}>
          {isEdit && isPending ? (
            <Spinner />
          ) : (
            <form
              id="room-form"
              autoComplete="off"
              style={{ height: "100%" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              onSubmit={handleSubmit(onsubmit)}
            >
              <div className={roomStlye.roomForm}>
                <Tab onChangeTab={(e) => setActiveTab(e)}>
                  <TabHeader>
                    <TabHeaderItem idTab="1" title="Thông tin" selectDefault />
                    <TabHeaderItem idTab="2" title="Hình ảnh, mô tả" />
                    <TabHeaderItem idTab="3" title="Vị trí" />
                  </TabHeader>
                  <TabContent>
                    <TabContentItem idTab="1">
                      <div className={roomStlye.moreInfo}>
                        <BaseInfoInput />
                        <ServicesInput />
                      </div>
                    </TabContentItem>
                    <TabContentItem idTab="2">
                      <MoreInfoInput
                        roomImages={data?.roomImages}
                        onAddImage={handleGetImages}
                      />
                    </TabContentItem>
                    <TabContentItem idTab="3">
                      <RoomLocation
                        tabActived={activeTab === "3"}
                        location={data?.location}
                      />
                    </TabContentItem>
                  </TabContent>
                </Tab>
              </div>
            </form>
          )}
        </FormProvider>
      </ModalContent>
      <ModalFooter>
        <Button
          status="primary"
          noAnimation
          type="submit"
          isLoading={isProcessing}
          form="room-form"
        >
          Cất giữ
        </Button>
        <Button
          status="default"
          typeButton="outline"
          noAnimation
          onClick={() => openDialog(false)}
        >
          Hủy bỏ
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAndUpdateRoom;
