import axiosInstance from "@shared/lib/axios.config";
import type { RoomCreateRequest } from "../types/room.type";
import type { ResponseApi } from "@shared/types/common";
import { API_ENDPOINT } from "@shared/constants/endpoint";
import type { AxiosRequestConfig } from "axios";
import type { RoomModel } from "@shared/types/room";
import type { PagingResponse } from "@shared/types/dynamic";

type RoomPagingRequest = {
  pageNumber: number;
  pageSize: number;
  searchKey: string;
};

type ChangeStatusRequest = {
  id: string;
  status: number;
};

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

export const getPagingRoom = async (
  { signal }: AxiosRequestConfig,
  request: RoomPagingRequest,
) => {
  try {
    const response = await axiosInstance.get<
      ResponseApi<PagingResponse<RoomModel[]>>
    >(
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

export const getRoomDetail = async (
  { signal }: AxiosRequestConfig,
  idRoom?: string,
) => {
  try {
    if (!idRoom) return;
    const response = await axiosInstance.get<ResponseApi<RoomModel>>(
      API_ENDPOINT.ROOM.GET_DETAIL(idRoom),
      { signal },
    );

    return response.data.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

export const changeStatus = async (request: ChangeStatusRequest) => {
  try {
    const response = await axiosInstance.patch<ResponseApi<RoomModel>>(
      API_ENDPOINT.ROOM.CHANGE_STATUS(request.id, request.status),
    );

    return response.data.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
