import type { RoomImage } from "./roomImage";
import type { RoomType } from "./roomType";

export type RoomModel = {
  id: string;
  roomTypeId: string;
  roomNumber: number | null;
  roomName: string;
  status: number;
  description?: string;
  currentPrice: number | null;
  acreage: number | null;
  priceWeekend: number | null;
  imageUrl?: string;
  location?: string;
  numberAdults: number | null;
  numberChild: number | null;
  numberBedroom: number | null;
  numberBathRoom: number | null;
  numberBed: number | null;
  services: Service[];
  roomImages: RoomImage[];
  roomType: RoomType;
};

type Service = {
  code: string;
};
