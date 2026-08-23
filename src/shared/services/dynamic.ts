import { API_ENDPOINT } from "@shared/constants/endpoint";
import axiosInstance from "@shared/lib/axios.config";
import type { ResponseApi } from "@shared/types/common";
import type {
  DeleteDataRequest,
  DynamicDataPagingRequest,
  DynamicDataPagingResponse,
} from "@shared/types/dynamic";

export const getDynamicData = async <T extends readonly unknown[]>(
  request: DynamicDataPagingRequest,
) => {
  try {
    const response = await axiosInstance.post<DynamicDataPagingResponse<T>>(
      API_ENDPOINT.DYNAMIC.GET_DYNAMIC,
      request,
    );
    return response.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

export const deleteData = async (deleteRequest: DeleteDataRequest) => {
  try {
    const response = await axiosInstance.post<ResponseApi<string>>(
      API_ENDPOINT.DYNAMIC.DELETE_DATA,
      deleteRequest,
    );

    if (response.status !== 200) return false;

    return response.data.isSuccess;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
