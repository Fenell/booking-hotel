import { API_ENDPOINT } from "@shared/constants/endpoint";
import axiosInstance from "@shared/lib/axios.config";
import type { ResponseApi } from "@shared/types/common";
import type { RoomImage } from "@shared/types/roomImage";

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

type UploadImageRequest = {
  roomCode: string;
  imageFiles: File[];
};
type UploadImageResponse = {
  totalFile: number;
  successCount: number;
  failedCount: number;
  fileData: FileData[];
};

type FileData = {
  fileName: string;
  isValid: boolean;
  error?: string;
};
export const uploadImages = async (request: UploadImageRequest) => {
  try {
    const response = await axiosInstance.postForm<
      ResponseApi<UploadImageResponse>
    >(API_ENDPOINT.IMAGE.UPLOAD_IMAGE, request);
    return response.data.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
