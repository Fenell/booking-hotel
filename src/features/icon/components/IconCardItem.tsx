import iconStyle from "../style/Icon.module.css";
import type { IconResponse } from "../types/icon.type";
import type { CSSProperties } from "react";

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
  const iconClass: string = `fa-regular fa-${iconCode} ${
    sizeIcon && "fa-" + sizeIcon
  }`;
  const iconColor: CSSProperties = {
    color: color ?? "#2796fd",
  };

  const handleEdit = () => {
    console.log(id);
  };

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
          <i className="fa-light fa-eye"></i>
          <i className="fa-light fa-eye-low-vision"></i>
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
          <div className={iconStyle.status}>
            <span
              className={iconStyle.stausText}
              style={{ fontSize: "0.7rem" }}
            >
              Hoạt động
            </span>
          </div>
        </div>
        <div className={iconStyle.infoInfoBox}></div>
      </div>
    </div>
  );
};

export default IconCardItem;
