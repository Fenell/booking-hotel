import RoomPageContent from "../components/RoomPageContent";
import { RoomContextProvider } from "../store/RoomContext";

const RoomPage = () => {
  return (
    <RoomContextProvider>
      <title>Quản lý phòng</title>
      <RoomPageContent />
    </RoomContextProvider>
  );
};

export default RoomPage;
