import type { IconResponse } from "@features/icon/types/icon.type";
import { getDynamicData } from "@shared/services/dynamic";
import type { DynamicDataPagingRequest } from "@shared/types/dynamic";
import { useQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import serviceStyle from "../style/service.module.css";
import { useServiceContext } from "../context/ServiceContext";
import { useFormContext } from "react-hook-form";
import type { ServiceResponse } from "../types/service.type";
import { DEFAULT_ICON_COLOR } from "@features/icon";

const IconItem = ({ id, iconCode, sizeIcon, color, ...prop }: IconResponse) => {
  const { selectIcon } = useServiceContext();

  const { setValue } = useFormContext<ServiceResponse>();
  const getIconClass = (iconCode: string, sizeIcon?: string): string => {
    return `fa-regular fa-${iconCode} ${sizeIcon && "fa-" + sizeIcon}`;
  };
  const getIconColor = (color?: string): CSSProperties => ({
    color: color ?? DEFAULT_ICON_COLOR,
  });
  const hadleSelectIcon = () => {
    // console.log({ id, iconCode, sizeIcon, color, ...prop });
    selectIcon({ id, iconCode, sizeIcon, color, ...prop });
    setValue("idIcon", id);
  };
  return (
    <div className={serviceStyle.iconSelectItem} onClick={hadleSelectIcon}>
      <i
        className={getIconClass(iconCode, sizeIcon)}
        style={getIconColor(color)}
      ></i>
    </div>
  );
};

const iconRequest: DynamicDataPagingRequest = {
  tableNames: "icons",
  filters: [{ field: "is_active", operator: "=", value: "true" }],
  pageNumber: 1,
  pageSize: 100,
};

const IconSelect = () => {
  const { data, isPending } = useQuery({
    queryKey: ["icons"],
    queryFn: () => getDynamicData<IconResponse[]>(iconRequest),
  });

  if (isPending) {
    return <span>Loading...</span>;
  }
  const iconData = data?.data;
  return (
    <div className={serviceStyle.iconSelectBox}>
      <div className={serviceStyle.iconSelectList}>
        {iconData?.map((c) => (
          <IconItem
            key={c.id}
            {...c}
            id={c.id}
            iconCode={c.iconCode}
            sizeIcon={c.sizeIcon}
            color={c.color}
          />
        ))}
      </div>
    </div>
  );
};

export default IconSelect;
