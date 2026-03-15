import type { LatLng, LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { RoomCreateRequest } from "../types/room.type";
import { useFormContext } from "react-hook-form";

const FixMapSize = (tabActived: { tabActived: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (tabActived) {
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }
  }, [tabActived, map]);

  return null;
};

const DEFAULT_CENTER: LatLngExpression = [21.0285, 105.8542];

const LocationMaker = ({ location }: { location?: string }) => {
  const { setValue } = useFormContext<RoomCreateRequest>();

  const [position, setPosition] = useState<LatLng | LatLngExpression | null>(
    DEFAULT_CENTER,
  );
  const map = useMap();

  useEffect(() => {
    if (!location) {
      map.flyTo(DEFAULT_CENTER, map.getZoom());
      setPosition(DEFAULT_CENTER);
      return;
    }

    const [lat, lng] = location.split(":").map(Number);
    const loc: LatLngExpression = [lat, lng];
    setPosition(loc);
    map.flyTo(loc, 15);
  }, [location, map]);

  useMapEvents({
    click(e) {
      // map.locate();
      setValue("location", `${e.latlng.lat}:${e.latlng.lng}`);
      setPosition(e.latlng);
    },
    // locationfound(e) {
    //   setPosition(e.latlng);
    //   map.flyTo(e.latlng, map.getZoom());
    // },
  });

  return (
    position && (
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    )
  );
};

const RoomLocation = ({
  tabActived,
  location,
}: {
  tabActived: boolean;
  location?: string;
}) => {
  const position1: LatLngExpression = [21.001, 105.81];

  return (
    <div>
      <MapContainer
        zoom={15}
        center={position1}
        scrollWheelZoom={false}
        style={{ height: "calc(100vh - 300px)" }}
      >
        <FixMapSize tabActived />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMaker location={location} />
      </MapContainer>
    </div>
  );
};

export default RoomLocation;
