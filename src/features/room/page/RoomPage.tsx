import RoomListView from "./RoomListView";
import { RoomContextProvider } from "../context/RoomContext";

const RoomPage = () => {
  return (
    <RoomContextProvider>
      <title>Quản lý phòng</title>
      <RoomListView />
    </RoomContextProvider>
  );
};

export default RoomPage;
