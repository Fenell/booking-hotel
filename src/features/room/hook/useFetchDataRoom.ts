import { useQuery } from "@tanstack/react-query";
import { getPagingRoom } from "../api/room.api";

export const useFetchDataRoom = (isReady: boolean) => {
  console.log(isReady);
  const { data, isPending } = useQuery({
    queryKey: ["rooms"],
    queryFn: (signal) =>
      getPagingRoom(signal, { pageNumber: 1, pageSize: 100, searchKey: "" }),
    enabled: isReady,
  });

  return { data, isPending };
};
