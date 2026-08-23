/** Trạng thái một cột được lưu vào localStorage */
export type PersistedColumnState = {
  field: string;
  /** px sau khi resize — không có nghĩa là dùng width mặc định */
  width?: number;
  visible: boolean;
};

/** Schema cấu hình grid lưu tại localStorage["grid:<gridKey>"] */
export type PersistedGridConfigV1 = {
  version: 1;
  /** Thứ tự mảng = thứ tự cột (sẵn cho drag-reorder sau này) */
  columns: PersistedColumnState[];
  updatedAt: string;
};
