import CreateAndUpdateRoom from "./CreateAndUpdateRoom";
import roomStyle from "../style/room.module.css";
import { Button } from "@shared/components/UI";

const RoomPageContent = () => {
  const isLoading: boolean = false;
  return (
    <>
      {isLoading && <CreateAndUpdateRoom />}
      <div className={roomStyle.box}>
        <div className={roomStyle.actionBar}>
          <Button noAnimation status="success">
            Thêm mới
          </Button>
        </div>
      </div>
    </>
  );
};

export default RoomPageContent;
