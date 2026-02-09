export type RoomImage = {
  id: string;
  roomId: string;
  fileName: string;
  isCover: boolean;
  sortOrder: number;
  url: string;

  // RoomId
  //    FileName {get;set;}
  //     public bool IsCover {get;set;}
  //     public int SortOrder {get;set;}
  //     public int Status {get;set;}
  //     public string? Url { get; set; }
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
