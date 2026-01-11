import classNames from "classnames";
import {
  CloseIcon,
  FailureIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from "./IconToas";
import toastStyle from "./Toast.module.css";

import { motion } from "motion/react";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  const iconMap = {
    success: <SuccessIcon />,
    error: <FailureIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />,
  };

  const toastIcon = iconMap[type] || null;

  return (
    <motion.div
      initial={{ translateX: "100%" }}
      animate={{ translateX: "0%" }}
      exit={{ translateX: "100%", transition: { duration: 0.5 } }}
      // className={`toast toast--${type}`}
      className={classNames(toastStyle.toast, toastStyle[`toast--${type}`])}
      role="alert"
    >
      <div className={toastStyle["toast-message"]}>
        {toastIcon && (
          // <div className="icon icon--lg icon-thumb">{toastIcon}</div>
          <div
            className={classNames(
              toastStyle.icon,
              toastStyle["icon--lg"],
              toastStyle["icon-thumb"]
            )}
          >
            {toastIcon}
          </div>
        )}
        <p>{message}</p>
      </div>
      <button className={toastStyle["toast-close-btn"]} onClick={onClose}>
        <span className={toastStyle.icon}>
          <CloseIcon />
        </span>
      </button>
    </motion.div>
  );
};

export default Toast;
