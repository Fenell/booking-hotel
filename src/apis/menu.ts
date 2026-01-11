import axios, { type AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../../config";
import type { ResponseApi } from "@types/common";
import type { Menu } from "@types/menu";

const instance = axios.create({
  baseURL: `${API_BASE_URL}/menu`,
  headers: { "X-Api-Version": 1.0 },
});

export const getMenu = async ({ signal }: AxiosRequestConfig) => {
  try {
    const response = await instance.get<ResponseApi<Menu[]>>("", {
      signal,
    });

    return response.data.data;
  } catch (err) {
    console.log(err);
  }
};
