import type { RoomImage } from "./image.type";

/**
 * Dữ liệu form gửi lên khi tạo/sửa phòng.
 * BE nhận `roomServices` rồi tự đồng bộ bảng nối `room_service`
 * (xem UpdateRoomCommandHandler.SyncRoomServicesAsync).
 */
export type RoomCreateRequest = {
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
  roomServices: RoomService[];
};

/**
 * Dữ liệu một phòng đọc từ API (list, chi tiết, đổi trạng thái).
 * Đúng bằng `RoomCreateRequest` cộng hai quan hệ BE trả kèm — `RoomDto` bên BE
 * cũng dựng theo đúng cách này, nên hai chiều đọc/ghi không bao giờ lệch nhau.
 */
export type RoomModel = RoomCreateRequest & {
  roomImages: RoomImage[];
  roomType: RoomTypeSummary;
};

export type RoomService = {
  serviceId: string;
  /** BE trả kèm khi đọc chi tiết phòng; form không dùng và không cần gửi lên */
  id?: string;
  roomId?: string;
};

/**
 * Loại phòng lồng trong response chi tiết phòng.
 * Đây là một phần hợp đồng API của Phòng nên do feature Phòng tự khai báo —
 * feature Loại phòng không cần biết tới nó. Lưới đọc qua dot-path
 * "roomType.typeName" (xem shared/types/gridConfig.ts).
 */
export type RoomTypeSummary = {
  id: string;
  typeName: string;
  typeCode: string;
};
