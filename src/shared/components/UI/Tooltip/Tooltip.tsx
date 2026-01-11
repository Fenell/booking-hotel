import { useState, type ReactNode } from "react";
import tooltipStyle from "./Tooltip.module.css";
import { motion } from "motion/react";
import classNames from "classnames";

type TooltipProps = {
  content?: string;
  position: "top" | "bottom";
  children: ReactNode;
};

const Tooltip = ({ content, children, position = "top" }: TooltipProps) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div
      className={tooltipStyle.tooltip}
      onMouseOver={() => setIsShow(true)}
      onMouseLeave={() => setIsShow(false)}
    >
      {isShow && (
        <motion.div
          initial={{ opacity: 0, y: -10, x: "-50%" }}
          animate={{ opacity: 1, y: 0 }}
          className={classNames(
            tooltipStyle["tooltip-content"],
            tooltipStyle[position]
          )}
        >
          {content}
        </motion.div>
      )}
      {children}
    </div>
  );
};

export default Tooltip;
