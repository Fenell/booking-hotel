import { API_ENDPOINT } from "@shared/constants/endpoint";
import axiosInstance from "@shared/lib/axios.config";
import type { LoginReponse, LoginRequest } from "@shared/types/auth";
import type { ResponseApi } from "@shared/types/common";
import axios from "axios";

export const setAccessToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("token");
};

export const deleteAcessToken = () => {
  localStorage.removeItem("token");
};

export const login = async (loginRequest: LoginRequest) => {
  try {
    const response = await axiosInstance.post<ResponseApi<LoginReponse>>(
      API_ENDPOINT.AUTH.LOGIN,
      loginRequest,
    );
    if (response.data.isSuccess) {
      return response.data.data;
    }
  } catch (error) {
    // console.log(JSON.stringify(error));
    if (axios.isAxiosError<ResponseApi<LoginReponse>>(error)) {
      if (error.response?.status === 400) {
        return error.response.data.error?.description;
      }
    }
  }
};
