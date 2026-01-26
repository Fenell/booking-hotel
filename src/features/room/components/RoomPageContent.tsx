import CreateAndUpdateRoom from "./CreateAndUpdateRoom";
import roomStyle from "../style/room.module.css";
import { Button } from "@shared/components/UI";
import { useRoomContext } from "../store/RoomContext";

const RoomPageContent = () => {
  const { isOpen, openDialog } = useRoomContext();
  return (
    <>
      {isOpen && <CreateAndUpdateRoom />}
      <div className={roomStyle.box}>
        <div className={roomStyle.actionBar}>
          <Button noAnimation status="success" onClick={() => openDialog(true)}>
            Thêm mới
          </Button>
        </div>
      </div>
    </>
  );
};

export default RoomPageContent;
