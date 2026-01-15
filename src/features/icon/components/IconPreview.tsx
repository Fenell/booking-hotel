import { useFormContext, useWatch } from "react-hook-form";
import type { IconResponse } from "../types/icon.type";
import type { CSSProperties } from "react";

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
    color: color ?? "#2796fd",
  };
  // console.log(color);
  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        border: "solid 1px #dedede",
        borderRadius: "6px",
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
