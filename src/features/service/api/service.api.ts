import axiosInstance from "@shared/lib/axios.config";
import type {
  ServiceCreateAndUpdateModel,
  ServiceOption,
  ServiceResponse,
  ServiceUpdateRequest,
} from "../types/service.type";
import { getDynamicData } from "@shared/services/dynamic";
import type { DynamicDataPagingRequest } from "@shared/types/dynamic";
import { API_ENDPOINT } from "@shared/constants/endpoint";
import type { ResponseApi } from "@shared/types/common";

export const createService = async (request: ServiceCreateAndUpdateModel) => {
  try {
    // console.log(request);
    const response = await axiosInstance.post<ResponseApi<ServiceResponse>>(
      API_ENDPOINT.SERVICE.CREATE_SERVICE,
      request,
    );

    if (response.status !== 201) {
      throw new Error(JSON.stringify(response.data));
    }

    return response.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

export const updateService = async (request: ServiceUpdateRequest) => {
  try {
    const response = await axiosInstance.put<ResponseApi<string>>(
      API_ENDPOINT.SERVICE.UPDATE_SERVICE(request.id),
      request,
    );

    if (response.status !== 200) {
      throw new Error(JSON.stringify(response.data));
    }

    return response.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

/**
 * Shape thô mà function get_data trả về cho danh sách rút gọn.
 * Cố ý để private trong file này: ra khỏi đây chỉ còn ServiceOption.
 */
type ServiceOptionRow = {
  id: string;
  serviceName: string;
};

const serviceOptionsRequest: DynamicDataPagingRequest = {
  tableNames: "services",
  pageNumber: 1,
  pageSize: 100,
};

/**
 * Lấy danh sách dịch vụ rút gọn cho feature khác (vd: chọn tiện ích khi tạo phòng).
 * Trả thẳng {value,label} nên nơi gọi không cần biết bảng nào, field tên gì.
 */
export const getServiceOptions = async (): Promise<ServiceOption[]> => {
  const response =
    await getDynamicData<ServiceOptionRow[]>(serviceOptionsRequest);

  return response.data.map((service) => ({
    value: service.id,
    label: service.serviceName,
  }));
};
