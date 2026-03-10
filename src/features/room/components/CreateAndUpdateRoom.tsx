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
import { type GridApi } from "ag-grid-community";
import type { RoomModel } from "@shared/types/room";
import type { FileInput } from "@shared/components/UI/Image/DragAndDropImage";
import RoomLocation from "./RoomLocation";

type CreateAndUpdateRoomProps = {
  gridApi?: GridApi<RoomModel> | null;
};

const CreateAndUpdateRoom = ({ gridApi }: CreateAndUpdateRoomProps) => {
  const {
    isEdit,
    methods,
    isPending,
    isProcessing,
    data,
    openDialog,
    onsubmit,
    handleGetImages,
  } = useRoomForm(gridApi!);
  const { handleSubmit } = methods;

  const title = isEdit ? "Chỉnh sửa thông tin phòng" : "Thêm mới";

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
                <Tab>
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
                      <RoomLocation />
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
          status="success"
          noAnimation
          type="submit"
          isLoading={isProcessing}
          form="room-form"
        >
          Cất giữ
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAndUpdateRoom;
