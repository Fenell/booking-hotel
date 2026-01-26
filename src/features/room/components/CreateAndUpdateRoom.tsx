import { Modal, ModalContent, ModalHeader } from "@shared/components/UI/Modal";
import { useRoomContext } from "../store/RoomContext";
import roomStlye from "../style/room.module.css";
import { Input } from "@shared/components/UI/Input";
import classNames from "classnames";
import Editor from "@shared/components/UI/RichText/RichText";
const CreateAndUpdateRoom = () => {
  const { openDialog } = useRoomContext();
  return (
    <Modal size="lg" onClose={() => openDialog(false)}>
      <ModalHeader title="Thêm mới" />
      <ModalContent>
        <form id="room-form" style={{ height: "100%" }}>
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
                  roomStlye.fullField,
                  roomStlye.inputField,
                )}
              >
                <label htmlFor="description">Mô tả</label>
                <Editor />
              </div>
            </div>
            <div className={roomStlye.moreInfo}>
              <p>Tiện ích</p>
            </div>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateAndUpdateRoom;
