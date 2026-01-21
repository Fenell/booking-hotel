import axiosInstance from "@shared/lib/axios.config";
import type {
  ServiceCreateAndUpdateModel,
  ServiceResponse,
  ServiceUpdateRequest,
} from "../types/service.type";
import { API_ENDPOINT } from "@shared/constants/endpoint";
import type { ResponseApi } from "@shared/types/common";

export const createService = async (request: ServiceCreateAndUpdateModel) => {
  try {
    request.serviceCode = request.serviceName;
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
    request.serviceCode = request.serviceName;
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
