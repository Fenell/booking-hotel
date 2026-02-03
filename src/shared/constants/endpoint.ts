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
    GET_PAGING: (
      pageNumber: number = 1,
      pageSize: number = 100,
      searchKey: string = "",
    ) =>
      `/room?pageNumber=${pageNumber}&pageSize=${pageSize}&searchKey=${searchKey}`,
  },
};
