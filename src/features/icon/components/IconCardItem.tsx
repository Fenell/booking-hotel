import classNames from "classnames";
import iconStyle from "../style/Icon.module.css";
import type { IconResponse } from "../types/icon.type";
import type { CSSProperties } from "react";

const IconCardItem = () => {
  const iconTest: IconResponse = {
    id: "1",
    iconCode: "fa-plane",
    description: "sfsdhkfsdhkjfdhjk",
    iconName: "Wifi",
    sizeIcon: "lg",
  };

  const iconClass: string = `fa-regular ${iconTest.iconCode} ${
    iconTest.sizeIcon && "fa-" + iconTest.sizeIcon
  }`;
  const iconColor: CSSProperties = {
    color: iconTest.color ?? "#2796fd",
  };

  return (
    <div className={iconStyle.iconItem}>
      <div className={iconStyle.iconRow}>
        <span>{iconTest.iconName}</span>
        {/* <i className="fa-regular fa-plane fa-lg"></i> */}
        <i className={iconClass} style={iconColor}></i>
      </div>
      <div className={iconStyle.iconRow}>
        <span>Mô tả</span>
        <span>{iconTest.description}</span>
      </div>
      {/* <div className={iconStyle.iconRow}>
        <span>{iconTest.iconName}</span>
        <i className="fa-regular fa-bin"></i>
      </div>
      <div className={iconStyle.iconRow}>
        <span>{iconTest.iconName}</span>
        <i className="fa-regular fa-bin"></i>
      </div> */}
    </div>
  );
};

export default IconCardItem;
