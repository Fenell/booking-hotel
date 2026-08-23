import { useQuery } from "@tanstack/react-query";
import { getServiceOptions } from "../api/service.api";
import { serviceKeys } from "../api/service.keys";
import type { ServiceOption } from "../types/service.type";

/** Tham chiếu cố định để nơi gọi không bị re-render vì mảng rỗng mới mỗi lần */
const EMPTY: ServiceOption[] = [];

/**
 * Hook công bố của feature Dịch vụ dành cho feature khác.
 *
 * Feature gọi nó (vd: chọn tiện ích khi tạo phòng) chỉ nhận {value,label} —
 * không biết dữ liệu lấy từ bảng nào, cache key là gì, Service có field gì.
 * Nhờ vậy màn hình Dịch vụ đổi cột hay đổi view cũng không làm vỡ nơi gọi.
 */
export const useServiceOptions = () => {
  const { data, isPending } = useQuery({
    queryKey: serviceKeys.options(),
    queryFn: getServiceOptions,
  });

  return { options: data ?? EMPTY, isPending };
};
