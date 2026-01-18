import { API_ENDPOINT } from "@shared/constants/endpoint";
import axiosInstance from "@shared/lib/axios.config";
import type {
  IconCreateUpdateModel,
  IconResponse,
  IconUpdateRequest,
} from "../types/icon.type";
import type { ResponseApi } from "@shared/types/common";

export const createIcon = async (iconCreate: IconCreateUpdateModel) => {
  try {
    iconCreate.isActive = true;
    const response = await axiosInstance.post<ResponseApi<IconResponse>>(
      API_ENDPOINT.ICON.CREATE_ICON,
      iconCreate,
    );
    if (response.status !== 201) {
      throw new Error(JSON.stringify(response.data));
    }
    return response.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

export const updateIcon = async (updateRequest: IconUpdateRequest) => {
  try {
    // console.log(updateRequest.data);
    // updateRequest.data.isActive = true;
    const response = await axiosInstance.put<ResponseApi<string>>(
      API_ENDPOINT.ICON.UPDATE_ICON(updateRequest.id),
      updateRequest.data,
    );
    if (response.status !== 200) {
      throw new Error(JSON.stringify(response.data));
    }
    return response.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
