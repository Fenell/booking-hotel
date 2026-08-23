/**
 * Ảnh phòng. BE lưu qua bảng dùng chung `file_attachments` (liên kết mềm bằng
 * cặp EntityType + EntityId), nhưng hiện chỉ có màn Phòng dùng nên type và
 * hàm gọi API đều nằm trong feature này. Khi có entity thứ hai cần đính kèm
 * file thì mới tách lên shared/.
 */
export type RoomImage = {
  id: string;
  roomId: string;
  fileName: string;
  isCover: boolean;
  sortOrder: number;
  url: string;
};

export type UploadImageRequest = {
  roomCode: string;
  imageFiles: File[];
};

export type UploadImageResponse = {
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
