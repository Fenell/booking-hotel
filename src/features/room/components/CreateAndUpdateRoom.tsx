import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@shared/components/UI/Modal";
import { useRoomContext } from "../store/RoomContext";
import roomStlye from "../style/room.module.css";
import { Input } from "@shared/components/UI/Input";
import classNames from "classnames";
import Editor from "@shared/components/UI/RichText/RichText";
import Checkbox from "@shared/components/UI/Checkbox/Checkbox";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDynamicData } from "@shared/services/dynamic";
import type { DyanmicDataPagingRequest } from "@shared/types/dynamic";
import type { ServiceResponse } from "@features/service/types/service.type";
import Spinner from "@shared/components/Spinner/Spinner";
import { Button } from "@shared/components/UI";
import DragAndDropImage from "@shared/components/UI/Image/DragAndDropImage";

const servicesRequest: DyanmicDataPagingRequest = {
  tableNames: "services",
  pageNumber: 1,
  pageSize: 100,
};

const CreateAndUpdateRoom = () => {
  const { openDialog } = useRoomContext();
  const [avc, setAvc] = useState(false);
  const { data, isPending } = useQuery({
    queryKey: ["services"],
    queryFn: () => getDynamicData<ServiceResponse[]>(servicesRequest),
  });

  if (isPending) {
    return;
  }
  return (
    <Modal size="lg" onClose={() => openDialog(false)}>
      <ModalHeader title="Thêm mới" />
      <ModalContent>
        <form id="room-form" style={{ height: "100%" }}>
          {isPending ? (
            <Spinner />
          ) : (
            <div className={roomStlye.roomForm}>
              <div className={roomStlye.baseInfo}>
                <p className={roomStlye.title}>Thông tin cơ bản</p>
                <div
                  className={classNames(
                    roomStlye.fullField,
                    roomStlye.inputField,
                  )}
                >
                  <label htmlFor="roomName">Tên phòng</label>
                  <Input id="roomName" />
                </div>
                <div
                  className={classNames(
                    roomStlye.halfField,
                    roomStlye.inputField,
                  )}
                >
                  <div style={{ width: "100%" }}>
                    <label htmlFor="roomStatus">Trạng thái</label>
                    <Input id="roomName" />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label htmlFor="roomType">Loại phòng</label>
                    <Input id="roomName" />
                  </div>
                </div>
                <div
                  className={classNames(
                    roomStlye.halfField,
                    roomStlye.inputField,
                  )}
                >
                  <div style={{ width: "100%" }}>
                    <label htmlFor="roomStatus">Giá phòng (VNĐ)</label>
                    <Input id="roomName" type="number" />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label htmlFor="roomType">Giá phòng cuối tuần (VNĐ)</label>
                    <Input id="roomName" type="number" />
                  </div>
                </div>

                <div
                  className={classNames(
                    roomStlye.halfField,
                    roomStlye.inputField,
                  )}
                >
                  <div style={{ width: "100%" }}>
                    <label htmlFor="roomStatus">Diện tích (m3)</label>
                    <Input id="roomName" type="number" />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label htmlFor="roomType">Số người lớn</label>
                    <Input id="roomName" type="number" />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label htmlFor="roomType">Số trẻ em</label>
                    <Input id="roomName" type="number" />
                  </div>
                </div>
                <div
                  className={classNames(
                    roomStlye.halfField,
                    roomStlye.inputField,
                  )}
                >
                  <div style={{ width: "100%" }}>
                    <label htmlFor="roomStatus">Số phòng tắm</label>
                    <Input id="roomName" type="number" />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label htmlFor="roomType">Số phòng ngủ</label>
                    <Input id="roomName" type="number" />
                  </div>
                  <div style={{ width: "100%" }}>
                    <label htmlFor="roomType">Số giường</label>
                    <Input id="roomName" type="number" />
                  </div>
                </div>
                <div
                  className={classNames(
                    roomStlye.fullField,
                    roomStlye.inputField,
                  )}
                >
                  <label htmlFor="roomName">Vị trí</label>
                  <Input id="roomName" />
                </div>
                <div
                  className={classNames(
                    roomStlye.fullField,
                    roomStlye.inputField,
                  )}
                >
                  <label htmlFor="description">Mô tả</label>
                  <Editor />
                </div>
              </div>

              <div className={roomStlye.moreInfo}>
                <p className={roomStlye.title}> Tiện ích</p>
                <p
                  style={{
                    display: "inline-block",
                    marginTop: "6px",
                    color: "#5fb2ed",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Chọn tất cả
                </p>
                <div className={roomStlye.unityRoom}>
                  {data?.data.map((service) => (
                    <Checkbox
                      index={service.id}
                      label={service.serviceName}
                      isChecked={avc}
                      value={service.id}
                      onChecked={() => setAvc((prev) => !prev)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className={roomStlye.title}>Hình ảnh</p>
                <DragAndDropImage />
              </div>
            </div>
          )}
        </form>
      </ModalContent>
      <ModalFooter>
        <Button status="success" noAnimation>
          Cất giữ
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAndUpdateRoom;
