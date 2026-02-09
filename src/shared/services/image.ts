import { API_ENDPOINT } from "@shared/constants/endpoint";
import axiosInstance from "@shared/lib/axios.config";
import type { ResponseApi } from "@shared/types/common";
import type {
  RoomImage,
  UploadImageRequest,
  UploadImageResponse,
} from "@shared/types/roomImage";

export const deleteImage = async (id: string) => {
  try {
    const response = await axiosInstance.delete<ResponseApi<RoomImage>>(
      API_ENDPOINT.IMAGE.DELETE_IMAGE(id),
    );
    return response.data.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

export const uploadImages = async (request: UploadImageRequest) => {
  try {
    const formData = new FormData();
    formData.append("roomCode", request.roomCode);
    request.imageFiles.forEach((file) => formData.append("imageFiles", file));

    const response = await axiosInstance.post<ResponseApi<UploadImageResponse>>(
      API_ENDPOINT.IMAGE.UPLOAD_IMAGE,
      formData,
    );

    return response.data.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
