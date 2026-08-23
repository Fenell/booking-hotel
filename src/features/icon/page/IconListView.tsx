import IconCardItem from "../components/IconCardItem";
import IconCreateItem from "../components/IconCreateItem";
import iconStyle from "../style/Icon.module.css";
import { useIconContext } from "../context/IconContext";
import CreateAndUpdateIcon from "../components/CreateAndUpdateIcon";
import { useQuery } from "@tanstack/react-query";
import { getDynamicData } from "@shared/services/dynamic";
import type { DynamicDataPagingRequest } from "@shared/types/dynamic";
import Spinner from "@shared/components/Spinner/Spinner";
import type { IconResponse } from "../types/icon.type";
import { AnimatePresence } from "motion/react";

const iconRequest: DynamicDataPagingRequest = {
  tableNames: "icons",
  pageNumber: 1,
  pageSize: 1000,
};

const IconListView = () => {
  const { isOpen } = useIconContext();
  const { data, isPending } = useQuery({
    queryKey: ["icons"],
    queryFn: () => getDynamicData<IconResponse[]>(iconRequest),
  });
  if (isPending) {
    return <Spinner />;
  }
  const iconData = data?.data;
  return (
    <>
      <AnimatePresence>{isOpen && <CreateAndUpdateIcon />}</AnimatePresence>
      <div style={{ width: "100%", height: "100%" }}>
        <div className={iconStyle.iconBox}>
          {iconData?.map((a) => (
            <IconCardItem {...a} key={a.id} />
          ))}

          <IconCreateItem />
        </div>
      </div>
    </>
  );
};

export default IconListView;
