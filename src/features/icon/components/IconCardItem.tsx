import iconStyle from "../style/Icon.module.css";
import type { IconResponse } from "../types/icon.type";
import type { CSSProperties } from "react";

const IconCardItem = () => {
  const iconTest: IconResponse = {
    id: "1",
    iconCode: "fa-plane",
    description: "sdfds fsdfd sfsdfwer ewrewr werwe rwer",
    iconName: "Wifi",
    sizeIcon: "lg",
    color: "#2796fd",
  };

  const iconClass: string = `fa-regular ${iconTest.iconCode} ${
    iconTest.sizeIcon && "fa-" + iconTest.sizeIcon
  }`;
  const iconColor: CSSProperties = {
    color: iconTest.color ?? "#2796fd",
  };

  return (
    <div className={iconStyle.iconItem}>
      <div className={iconStyle.iconHeader}>
        <div style={{ display: "flex", gap: "16px" }}>
          <div>
            <i className={iconClass} style={iconColor}></i>
          </div>
          <h3>{iconTest.iconName}</h3>
        </div>
        <div style={{ display: "flex", gap: "6px", cursor: "pointer" }}>
          <i className="fa-light fa-file-pen"></i>
          <i className="fa-light fa-eye"></i>
          <i className="fa-light fa-eye-low-vision"></i>
        </div>
      </div>

      <p className={iconStyle.iconDescription}>{iconTest.description}</p>
      <div className={iconStyle.iconInfo}>
        <div className={iconStyle.infoInfoBox}>
          <span>Màu sắc:</span>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{ backgroundColor: iconTest.color }}
              className={iconStyle.colorBox}
            ></div>
            <span>{iconTest.color}</span>
          </div>
        </div>
        <div className={iconStyle.infoInfoBox}>
          <span>Kích thước:</span>
          <div>
            <span>{iconTest.sizeIcon}</span>
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
