import React, { type ComponentPropsWithoutRef, type ReactNode } from "react";
import buttonStyle from "./Button.module.css";
import { motion } from "motion/react";
import classNames from "classnames";
import Tooltip from "../Tooltip/Tooltip";

type StatusBtn =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "primary"
  | "dark";

type RawButtonProps = {
  status: StatusBtn;
  icon?: string | null;
  noAnimation?: boolean;
  small?: boolean;
  children?: ReactNode | null;
} & ComponentPropsWithoutRef<"button">;

const RawButton = ({
  children,
  status,
  icon,
  small = false,
  noAnimation = false,
  //cssCustom,
  ...props
}: RawButtonProps) => {
  // console.log(noAnimation);
  const createIconVariant = (noAnimation: boolean): any => ({
    hover: { opacity: 1 },
    init: { opacity: noAnimation ? 1 : 0 },
  });
  const createTextVariant = (noAnimation: boolean): any => ({
    hover: { right: 0 },
    init: { right: noAnimation ? "0" : "10px" },
  });

  return (
    <div style={{ display: "inline-flex" }}>
      <motion.button
        whileHover={"hover"}
        className={classNames(
          buttonStyle["button"],
          small && buttonStyle["small"],
          buttonStyle[status] || buttonStyle["default"]
        )}
        {...props}
      >
        {icon && (
          <motion.i
            variants={createIconVariant(noAnimation)}
            initial={createIconVariant(noAnimation).init}
            className={classNames(icon, !!children && buttonStyle["btn-icon"])}
          ></motion.i>
        )}
        {children && (
          <motion.span
            variants={createTextVariant(noAnimation)}
            initial={createTextVariant(noAnimation).init}
            className={buttonStyle["button-text"]}
          >
            {children}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};

type ButtonProps = {
  showTooltip?: boolean;
  tooltipContent?: string;
  tooltipPosition?: "top" | "bottom";
} & RawButtonProps;

const Button = ({
  showTooltip = false,
  tooltipContent,
  tooltipPosition = "top",
  ...rawBtnProps
}: ButtonProps) => {
  if (!showTooltip) {
    return <RawButton {...rawBtnProps} />;
  }

  return (
    <Tooltip content={tooltipContent} position={tooltipPosition}>
      <RawButton {...rawBtnProps} />
    </Tooltip>
  );
};

export default Button;
