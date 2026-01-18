import { useMutation } from "@tanstack/react-query";
import { useIconContext } from "../store/IconContext";
import iconStyle from "../style/Icon.module.css";
import type { IconResponse } from "../types/icon.type";
import type { CSSProperties } from "react";
import { deleteData } from "@shared/services/dynamic";
import type { DeleteDataRequest } from "@shared/types/dynamic";
import { useToast } from "@shared/hooks/useToast";
import { queryClient } from "@app/queryClient";
import classNames from "classnames";

type IconCardItemProps = {} & IconResponse;

const IconCardItem = ({
  id,
  iconCode,
  iconName,
  color,
  description,
  sizeIcon,
  isActive,
}: IconCardItemProps) => {
  const { openOrCloseDialog } = useIconContext();
  const toast = useToast();
  const handleUpdateSuccess = () => {
    toast.success("Cập nhật trạng thái thành công ^_^");
    queryClient.invalidateQueries({ queryKey: ["icons"] });
  };

  const mutation = useMutation({
    mutationFn: deleteData,
    onSuccess: handleUpdateSuccess,
    onError: () => toast.warning("Cập nhật trạng thái thất bại T_T"),
  });

  const iconClass: string = `fa-regular fa-${iconCode} ${
    sizeIcon && "fa-" + sizeIcon
  }`;

  const iconColor: CSSProperties = {
    color: color ?? "#2796fd",
  };

  const handleEdit = () => {
    openOrCloseDialog(true, id);
  };

  const changeStatus = () => {
    const deleteRequest: DeleteDataRequest = {
      primaryKey: id,
      tableName: "icons",
      actionType: `${isActive ? "delete" : "update"}`,
    };
    mutation.mutate(deleteRequest);
  };
  const activeIcon = isActive ? "fa-eye" : "fa-eye-low-vision";
  return (
    <div className={iconStyle.iconItem}>
      <div className={iconStyle.iconHeader}>
        <div style={{ display: "flex", gap: "16px" }}>
          <div>
            <i className={iconClass} style={iconColor}></i>
          </div>
          <h3>{iconName}</h3>
        </div>
        <div style={{ display: "flex", gap: "6px", cursor: "pointer" }}>
          <i className="fa-light fa-file-pen" onClick={handleEdit}></i>
          <i className={`fa-light ${activeIcon}`} onClick={changeStatus}></i>
        </div>
      </div>

      <p className={iconStyle.iconDescription}>{description}</p>
      <div className={iconStyle.iconInfo}>
        <div className={iconStyle.infoInfoBox}>
          <span>Màu sắc:</span>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{ backgroundColor: color }}
              className={iconStyle.colorBox}
            ></div>
            <span>{color}</span>
          </div>
        </div>
        <div className={iconStyle.infoInfoBox}>
          <span>Kích thước:</span>
          <div>
            <span>{sizeIcon}</span>
          </div>
        </div>
        <div className={iconStyle.infoInfoBox}>
          <span>Trạng thái:</span>
          <div
            className={classNames(
              iconStyle.status,
              isActive ? iconStyle.active : iconStyle.stop,
            )}
          >
            <span
              className={classNames(
                iconStyle.statusText,
                isActive ? iconStyle.activeText : iconStyle.stopText,
              )}
              style={{ fontSize: "0.7rem" }}
            >
              {isActive ? "Hoạt động" : "Tạm ngừng"}
            </span>
          </div>
        </div>
        <div className={iconStyle.infoInfoBox}></div>
      </div>
    </div>
  );
};

export default IconCardItem;
