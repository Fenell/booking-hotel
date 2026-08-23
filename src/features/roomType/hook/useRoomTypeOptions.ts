import { useQuery } from "@tanstack/react-query";
import { getRoomTypeOptions } from "../api/roomType.api";
import { roomTypeKeys } from "../api/roomType.keys";
import type { RoomTypeOption } from "../types/roomType.type";

/** Tham chiếu cố định để nơi gọi không bị re-render vì mảng rỗng mới mỗi lần */
const EMPTY: RoomTypeOption[] = [];

/**
 * Hook công bố của feature Loại phòng dành cho feature khác.
 * Nơi gọi chỉ nhận {value,label}, không biết dữ liệu lấy từ bảng nào.
 */
export const useRoomTypeOptions = () => {
  const { data, isPending } = useQuery({
    queryKey: roomTypeKeys.options(),
    queryFn: getRoomTypeOptions,
  });

  return { options: data ?? EMPTY, isPending };
};
