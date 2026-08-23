import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import styles from "./Popover.module.css";
import { motion, AnimatePresence } from "motion/react";
import classNames from "classnames";
import { Button } from "../UI";
import type { StatusBtn } from "../UI/Button/Button";
type PopoverPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
type PopoverProp = {
  content: ReactNode;
  noAnimation?: boolean;
  status: StatusBtn;
  icon?: string;
  children?: ReactNode;
  position?: PopoverPosition;
  btnProps?: ComponentPropsWithoutRef<"button">;
  /**
   * Gọi khi popover đóng/mở. Dùng để nạp dữ liệu cho `content` ngay trước lúc
   * nó mount — đây là handler sự kiện nên đọc ref ở đây là hợp lệ.
   * (không dùng được `btnProps.onClick`: nó bị onClick nội bộ ghi đè)
   */
  onOpenChange?: (open: boolean) => void;
};
const getVariants = (position: string) => {
  switch (position) {
    case "top-left":
    case "top-right":
      return {
        initial: { opacity: 0, scale: 0.8, y: "-20%" },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: "-20%" },
      };

    case "bottom-left":
    case "bottom-right":
      return {
        initial: { opacity: 0, scale: 0.7, x: "-20%" },
        animate: { opacity: 1, x: "0", scale: 1 },
        exit: { opacity: 0, x: "-20%", scale: 0.7 },
      };

    case "left":
      return {
        initial: { opacity: 0, scale: 0.8, x: 10 },
        animate: { opacity: 1, scale: 1, x: 0 },
        exit: { opacity: 0, scale: 0.8, x: 10 },
      };

    case "right":
      return {
        initial: { opacity: 0, scale: 0.8, x: -10 },
        animate: { opacity: 1, scale: 1, x: 0 },
        exit: { opacity: 0, scale: 0.8, x: -10 },
      };

    default:
      return {
        initial: { opacity: 0, scale: 0.8, y: -10 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: -10 },
      };
  }
};
const Popover = ({
  content,
  noAnimation = false,
  status,
  icon,
  children,
  position = "bottom-left",
  btnProps,
  onOpenChange,
}: PopoverProp) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // useEffect(() => {
  //   if (isVisible && triggerRef.current) {
  //     const rect = triggerRef.current.getBoundingClientRect();
  //     // console.log(rect);
  //     setPos({
  //       top: rect.bottom + window.scrollY, // dưới trigger + 8px
  //       left: rect.right + window.scrollX,
  //     });
  //     console.log(rect.bottom + window.scrollY);
  //     console.log(rect.right);
  //   }
  // }, [isVisible, triggerRef]);

  useEffect(() => {
    const handeClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handeClickOutside);
    return () => {
      document.removeEventListener("mousedown", handeClickOutside);
    };
  }, []);

  const toggleVisibility = () => {
    onOpenChange?.(!isVisible);
    setIsVisible(!isVisible);
  };

  // const variants = {
  //   initial: { opacity: 0, scale: 0.7, x: "-20%" },
  //   animate: { opacity: 1, x: "0", scale: 1 },
  //   exit: { opacity: 0, x: "-20%", scale: 0.7 },
  // };

  const variants = getVariants(position);

  const transition = {
    type: "spring",
    stiffness: 400,
    damping: 30,
    duration: 0.2,
  };

  const positionClass = `position-${position}`;

  return (
    <div className={styles["popover-container"]}>
      <Button
        {...btnProps}
        ref={triggerRef}
        status={status}
        noAnimation={noAnimation}
        aria-haspopup="true"
        icon={icon}
        aria-expanded={isVisible}
        aria-controls="popover-content"
        type="button"
        onClick={toggleVisibility}
      >
        {children}
      </Button>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            aria-modal="true"
            role="dialog"
            ref={popoverRef}
            className={classNames(
              styles["popover-content"],
              styles[positionClass],
            )}
            variants={variants}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={transition}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Popover;
