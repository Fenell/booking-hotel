export const API_ENDPOINT = {
  DYNAMIC: {
    GET_DYNAMIC: "/dynamic/get-data",
    DELETE_DATA: "/dynamic/delete-data",
  },
  ICON: {
    CREATE_ICON: "/icon",
    UPDATE_ICON: (id: string) => `/icon/${id}`,
  },
  SERVICE: {
    CREATE_SERVICE: "/service/create",
    UPDATE_SERVICE: (id: string) => `/service/update/${id}`,
  },
  ROOM: {
    CREATE_ROOM: "/room",
    UPDATE_ROOM: (id: string) => `/room/${id}`,
    GET_PAGING: (
      pageNumber: number = 1,
      pageSize: number = 100,
      searchKey: string = "",
    ) =>
      `/room?pageNumber=${pageNumber}&pageSize=${pageSize}&searchKey=${searchKey}`,
    GET_DETAIL: (id: string) => `/room/${id}`,
    CHANGE_STATUS: (id: string, status: number) =>
      `/room/${id}?status=${status}`,
  },

  IMAGE: {
    DELETE_IMAGE: (id: string) => `file-data/delete-image/${id}`,
    UPLOAD_IMAGE: "file-data/upload-image",
  },
  AUTH: {
    LOGIN: "/auth/login",
  },
};
