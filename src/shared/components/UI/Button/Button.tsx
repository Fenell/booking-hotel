import React, {
  forwardRef,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import buttonStyle from "./Button.module.css";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";
import Tooltip from "../Tooltip/Tooltip";

export type StatusBtn =
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
  isLoading?: boolean;
  children?: ReactNode | null;
} & ComponentPropsWithRef<"button">;

type SpinnerIconProps = {
  isLoading?: boolean;
};
const SpinnerIcon = ({ isLoading }: SpinnerIconProps) => {
  const spinnerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.6,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.6,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  return (
    <svg
      width={"16px"}
      height={"16px"}
      fill="hsl(228, 97%, 42%)"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="radialGradient8932">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <style>
        {`
        @keyframes spin8932 {
          to {
            transform: rotate(360deg);
          }
        }

        #circle8932 {
          transform-origin: 50% 50%;
          stroke: url(#radialGradient8932);
          fill: none;
          animation: spin8932 0.5s linear infinite;
        }
      `}
      </style>

      <circle cx="10" cy="10" r="8" id="circle8932" strokeWidth="2" />
    </svg>
    // <AnimatePresence mode="wait">
    //   {isLoading && (
    //     <motion.div
    //       key="spinner"
    //       variants={spinnerVariants}
    //       intial="hidden"
    //       animate="visible"
    //       exit="exit"
    //     >

    //     </motion.div>
    //   )}
    // </AnimatePresence>
  );
};

const RawButton = forwardRef<HTMLButtonElement, RawButtonProps>(
  (
    {
      children,
      status,
      icon,
      small = false,
      noAnimation = false,
      isLoading = false,
      //cssCustom,
      ...props
    },
    ref,
  ) => {
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
          ref={ref}
          className={classNames(
            buttonStyle["button"],
            small && buttonStyle["small"],
            buttonStyle[status] || buttonStyle["default"],
            isLoading && buttonStyle["disabled"],
          )}
          {...props}
        >
          {isLoading ? (
            <SpinnerIcon />
          ) : (
            <>
              {" "}
              {icon && (
                <motion.i
                  variants={createIconVariant(noAnimation)}
                  initial={createIconVariant(noAnimation).init}
                  className={classNames(
                    icon,
                    !!children && buttonStyle["btn-icon"],
                  )}
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
            </>
          )}
        </motion.button>
      </div>
    );
  },
);

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
