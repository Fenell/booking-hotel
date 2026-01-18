import { type AxiosRequestConfig } from "axios";
import type { ResponseApi } from "shared/types/common";
import type { Menu } from "shared/types/menu";
import axiosInstance from "@shared/lib/axios.config";

export const getMenu = async ({ signal }: AxiosRequestConfig) => {
  try {
    const response = await axiosInstance.get<ResponseApi<Menu[]>>("/menu", {
      signal,
    });

    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
