import IconCardItem from "./IconCardItem";
import IconCreateItem from "./IconCreateItem";
import iconStyle from "../style/Icon.module.css";
import { useIconContext } from "../store/IconContext";
import CreateAndUpdate from "./CreateAndUpdate";
import { useQuery } from "@tanstack/react-query";
import { getDynamicData } from "@shared/services/dynamic";
import type { DyanmicDataPagingRequest } from "@shared/types/dynamic";
import Spinner from "@shared/components/Spinner/Spinner";
import type { IconResponse } from "../types/icon.type";

const iconRequest: DyanmicDataPagingRequest = {
  tableNames: "icons",
  pageNumber: 1,
  pageSize: 1000,
};

const IconPageContent = () => {
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
      {isOpen && <CreateAndUpdate />}
      <div style={{ width: "100%" }}>
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

export default IconPageContent;
