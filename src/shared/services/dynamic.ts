import axiosInstance from "@shared/lib/axios";
import type {
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
      "/dynamic/get-data",
      request
    );
    return response.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
