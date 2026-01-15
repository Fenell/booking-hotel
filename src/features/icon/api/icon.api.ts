import { API_ENDPOINT } from "@shared/constants/endpoint";
import axiosInstance from "@shared/lib/axios";
import type { IconCreateUpDateModel, IconResponse } from "../types/icon.type";
import type { ResponseApi } from "@shared/types/common";
import type { AxiosRequestConfig } from "axios";

export const createIcon = async (iconCreate: IconCreateUpDateModel) => {
  try {
    console.log(iconCreate);
    const response = await axiosInstance.post<ResponseApi<IconResponse>>(
      API_ENDPOINT.ICON.CREATE_ICON,
      iconCreate
    );
    if (response.status !== 201) {
      throw new Error(JSON.stringify(response.data));
    }
    return response.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
