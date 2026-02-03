import axiosInstance from "@shared/lib/axios.config";
import type { RoomCreateRequest } from "../types/room.type";
import type { ResponseApi } from "@shared/types/common";
import { API_ENDPOINT } from "@shared/constants/endpoint";
import type { AxiosRequestConfig } from "axios";
import type { RoomModel } from "@shared/types/room";

export const createRoom = async (createRequest: RoomCreateRequest) => {
  try {
    const response = await axiosInstance.post<ResponseApi<string>>(
      API_ENDPOINT.ROOM.CREATE_ROOM,
      createRequest,
    );
    return response.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

type RoomPagingRequest = {
  pageNumber: number;
  pageSize: number;
  searchKey: string;
};

export const getPagingRoom = async (
  { signal }: AxiosRequestConfig,
  request: RoomPagingRequest,
) => {
  try {
    const response = await axiosInstance.get<ResponseApi<RoomModel[]>>(
      API_ENDPOINT.ROOM.GET_PAGING(
        request.pageNumber,
        request.pageSize,
        request.searchKey,
      ),
      {
        signal,
      },
    );
    return response.data.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
