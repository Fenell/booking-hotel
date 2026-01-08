import axios, { type AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../../config";
import type { ResponseApi } from "@types/common";
import type { Menu } from "@types/menu";

const instance = axios.create({
  baseURL: `${API_BASE_URL}/menu`,
});

export const GetMenu = async ({ signal }: AxiosRequestConfig) => {
  try {
    const response = await instance.get<ResponseApi<Menu[]>>("/menu", {
      signal,
    });

    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
