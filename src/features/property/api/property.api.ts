import { getDynamicData } from "@shared/services/dynamic";
import type { DynamicDataPagingRequest } from "@shared/types/dynamic";
import { RENTAL_TYPE_LABEL, type PropertyOption } from "../types/property.type";

/** Shape thô từ function get_data — chỉ dùng trong file này */
type PropertyOptionRow = {
  id: string;
  propertyName: string;
  rentalType: number;
};

const propertyOptionsRequest: DynamicDataPagingRequest = {
  tableNames: "properties",
  pageNumber: 1,
  pageSize: 100,
};

/**
 * Lấy danh sách cơ sở rút gọn cho feature khác (vd: chọn cơ sở khi tạo phòng).
 * Nhãn kèm loại hình để phân biệt khách sạn / villa / homestay cùng tên.
 */
export const getPropertyOptions = async (): Promise<PropertyOption[]> => {
  const response = await getDynamicData<PropertyOptionRow[]>(
    propertyOptionsRequest,
  );

  return response.data.map((property) => ({
    value: property.id,
    label: `${property.propertyName} (${RENTAL_TYPE_LABEL[property.rentalType] ?? "Khác"})`,
  }));
};
