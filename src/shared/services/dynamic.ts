import { API_ENDPOINT } from "@shared/constants/endpoint";
import axiosInstance from "@shared/lib/axios";
import type { ResponseApi } from "@shared/types/common";
import type {
  DeleteDataRequest,
  DyanmicDataPagingRequest,
  DynamicDataPagingResponse,
} from "@shared/types/dynamic";
import camelcaseKeys from "camelcase-keys";

axiosInstance.interceptors.response.use((response) => {
  response.data = camelcaseKeys(response.data, { deep: true });
  return response;
});

export const getDynamicData = async <T extends readonly unknown[]>(
  request: DyanmicDataPagingRequest
) => {
  try {
    const response = await axiosInstance.post<DynamicDataPagingResponse<T>>(
      API_ENDPOINT.DYNAMIC.GET_DYNAMIC,
      request
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
      deleteRequest
    );

    if (response.status !== 200) return false;

    return response.data.isSuccess;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
