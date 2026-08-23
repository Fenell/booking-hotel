import { getDynamicData } from "@shared/services/dynamic";
import type { DynamicDataPagingRequest } from "@shared/types/dynamic";
import type { RoomTypeOption } from "../types/roomType.type";

/** Shape thô từ function get_data — chỉ dùng trong file này */
type RoomTypeOptionRow = {
  id: string;
  typeName: string;
};

const roomTypeOptionsRequest: DynamicDataPagingRequest = {
  tableNames: "room_types",
  pageNumber: 1,
  pageSize: 100,
};

/**
 * Lấy danh sách loại phòng rút gọn cho feature khác (vd: chọn loại khi tạo phòng).
 * Trả thẳng {value,label} nên nơi gọi không cần biết bảng nào, field tên gì.
 */
export const getRoomTypeOptions = async (): Promise<RoomTypeOption[]> => {
  const response = await getDynamicData<RoomTypeOptionRow[]>(
    roomTypeOptionsRequest,
  );

  return response.data.map((roomType) => ({
    value: roomType.id,
    label: roomType.typeName,
  }));
};
