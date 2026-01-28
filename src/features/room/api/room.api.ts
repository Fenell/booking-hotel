import axiosInstance from "@shared/lib/axios.config";
import type { RoomCreateRequest } from "../types/room.type";
import type { ResponseApi } from "@shared/types/common";
import { API_ENDPOINT } from "@shared/constants/endpoint";

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
