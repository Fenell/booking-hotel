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
