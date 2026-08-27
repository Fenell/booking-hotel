import { useState, type ReactNode } from "react";
import tooltipStyle from "./Tooltip.module.css";
import { motion } from "motion/react";
import classNames from "classnames";

type TooltipProps = {
  content?: string;
  position?: "top" | "bottom";
  /** Id của phần nội dung tooltip, để phần tử con trỏ tới bằng `aria-describedby`. */
  id?: string;
  children: ReactNode;
};

const Tooltip = ({
  content,
  children,
  id,
  position = "top",
}: TooltipProps) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div
      className={tooltipStyle.tooltip}
      onMouseOver={() => setIsShow(true)}
      onMouseLeave={() => setIsShow(false)}
      // onFocus/onBlur nổi bọt từ phần tử con (React map sang focusin/focusout)
      // nên người dùng bàn phím cũng thấy được tooltip.
      onFocus={() => setIsShow(true)}
      onBlur={() => setIsShow(false)}
    >
      {isShow && (
        <motion.div
          id={id}
          role="tooltip"
          initial={{ opacity: 0, y: -10, x: "-50%" }}
          animate={{ opacity: 1, y: 0 }}
          className={classNames(
            tooltipStyle["tooltip-content"],
            tooltipStyle[position],
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
