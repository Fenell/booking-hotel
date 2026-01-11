import axiosInstance from "@shared/lib/axios";
import type { DynamicDataPagingResponse } from "@shared/types/dynamic";
import type { AxiosRequestConfig } from "axios";
import camelcaseKeys from "camelcase-keys";

axiosInstance.interceptors.response.use((response) => {
  response.data = camelcaseKeys(response.data, { deep: true });
  return response;
});

export const getDynamicData = async <T extends []>({
  signal,
}: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance.get<DynamicDataPagingResponse<T>>(
      "/dynamic/get-data",
      { signal }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
