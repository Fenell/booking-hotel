export interface RoomCreateRequest {
  roomTypeId: string;
  roomNumber: number;
  roomName: string;
  status: number;
  description?: string;
  currentPrice: number;
  acreage: number;
  priceWeekend: number;
  imageUrl?: string;
  location?: string;
  numberAdults: number;
  numberChild: number;
  numberBedroom: number;
  numberBathRoom: number;
  numberBed: number;
  roomServices: RoomService[];
}

export interface RoomService {
  serviceId: string;
}
