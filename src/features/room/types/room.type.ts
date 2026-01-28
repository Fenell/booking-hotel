export interface RoomCreateRequest {
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
  roomServices: RoomService[];
}

export interface RoomService {
  serviceId: string;
}
