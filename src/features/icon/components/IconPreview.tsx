import { useFormContext, useWatch } from "react-hook-form";
import type { IconResponse } from "../types/icon.type";
import type { CSSProperties } from "react";
import { DEFAULT_ICON_COLOR } from "../icon.constants";

const IconPreview = () => {
  const { control } = useFormContext<IconResponse>();

  const [color, iconCode, sizeIcon] = useWatch({
    control,
    name: ["color", "iconCode", "sizeIcon"],
  });

  const iconClass: string = `fa-regular fa-${iconCode} ${
    sizeIcon && "fa-" + sizeIcon
  }`;
  const iconColor: CSSProperties = {
    color: color ?? DEFAULT_ICON_COLOR,
  };
  // console.log(color);
  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <i className={iconClass} style={iconColor}></i>
      {/* <i className="fa-light fa-newspaper"></i> */}
    </div>
  );
};

export default IconPreview;
