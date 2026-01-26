import RoomPageContent from "../components/RoomPageContent";
import { RoomContextProvider } from "../store/RoomContext";

const RoomPage = () => {
  return (
    <RoomContextProvider>
      <RoomPageContent />
    </RoomContextProvider>
  );
};

export default RoomPage;
