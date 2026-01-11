import { useQuery } from "@tanstack/react-query";
import { getMenu } from "./menu.api";

export const useMenu = () => {
  return useQuery({
    queryKey: ["menu"],
    queryFn: getMenu,
  });
};
