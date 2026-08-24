import { useQuery } from "@tanstack/react-query";
import { getPropertyOptions } from "../api/property.api";
import { propertyKeys } from "../api/property.keys";
import type { PropertyOption } from "../types/property.type";

/** Tham chiếu cố định để nơi gọi không bị re-render vì mảng rỗng mới mỗi lần */
const EMPTY: PropertyOption[] = [];

/**
 * Hook công bố của feature Cơ sở cho thuê dành cho feature khác.
 * Nơi gọi chỉ nhận {value,label}, không biết dữ liệu lấy từ bảng nào.
 */
export const usePropertyOptions = () => {
  const { data, isPending } = useQuery({
    queryKey: propertyKeys.options(),
    queryFn: getPropertyOptions,
  });

  return { options: data ?? EMPTY, isPending };
};
