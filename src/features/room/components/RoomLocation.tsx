import { APIProvider, Map } from "@vis.gl/react-google-maps";

const RoomLocation = () => {
  const API_KEY = "AIzaSyCSwMUHn6dBPK17FrmQTQL_si-TMdY2cng";
  return (
    <div>
      <APIProvider apiKey={API_KEY}>
        <Map
          style={{ width: "100vw", height: "100vh" }}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          defaultZoom={3}
          gestureHandling="greedy"
          disableDefaultUI
        />
      </APIProvider>
    </div>
  );
};

export default RoomLocation;
