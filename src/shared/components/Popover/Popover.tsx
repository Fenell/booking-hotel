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
import { createPortal } from "react-dom";
import { Button } from "../UI";
import type { StatusBtn } from "../UI/Button/Button";

// const PopoverPortal = ({ triggerRef, onClose, isVisible, children }) => {
//   const popoverRef = useRef(null);
//   const [pos, setPos] = useState({ top: 0, left: 0 });
//   const variants = {
//     initial: { opacity: 0, scale: 0.7, x: "-100%" },
//     animate: { opacity: 1, scale: 1, x: "-100%" },
//     exit: { opacity: 0, scale: 0.7, x: "-100%" },
//   };
//   const transition = {
//     type: "spring",
//     stiffness: 400,
//     damping: 30,
//     duration: 0.2,
//   };

//   useEffect(() => {
//     if (isVisible && triggerRef.current) {
//       const rect = triggerRef.current.getBoundingClientRect();
//       // console.log(rect);
//       setPos({
//         top: rect.bottom + window.scrollY, // dưới trigger + 8px
//         left: rect.right + window.scrollX,
//       });
//     }
//   }, [isVisible, triggerRef]);

//   useEffect(() => {
//     const handeClickOutside = (event) => {
//       if (!isVisible) return;
//       if (
//         popoverRef.current &&
//         !popoverRef.current.contains(event.target) &&
//         !triggerRef.current.contains(event.target)
//       ) {
//         onClose?.();
//       }
//     };
//     document.addEventListener("mousedown", handeClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handeClickOutside);
//     };
//   }, [isVisible, onClose, triggerRef]);

//   if (!isVisible) return null;
//   return createPortal(
//     <AnimatePresence>
//       <motion.div
//         style={{ top: pos.top, left: pos.left }}
//         aria-modal="true"
//         role="dialog"
//         ref={popoverRef}
//         className={classNames(styles["popover-content"])}
//         variants={variants}
//         initial="initial"
//         animate="animate"
//         exit="exit"
//         transition={transition}
//       >
//         {children}
//       </motion.div>
//     </AnimatePresence>,
//     document.body
//   );
// };

type PopoverProp = {
  content: ReactNode;
  noAnimation: boolean;
  status: StatusBtn;
  icon: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<"button">;

const Popover = ({
  children,
  content,
  noAnimation = false,
  status,
  icon,
  ...props
}: PopoverProp) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      console.log(rect);
      setPos({
        top: rect.bottom + window.scrollY, // dưới trigger + 8px
        left: rect.right + window.scrollX,
      });
    }
  }, [isVisible, triggerRef]);
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
    setIsVisible(!isVisible);
  };

  const variants = {
    initial: { opacity: 0, scale: 0.7, x: "-100%" },
    animate: { opacity: 1, x: "-100%", scale: 1 },
    exit: { opacity: 0, x: "-100%", scale: 0.7 },
  };
  const transition = {
    type: "spring",
    stiffness: 400,
    damping: 30,
    duration: 0.2,
  };

  return (
    <div className={styles["popover-container"]}>
      <Button
        {...props}
        ref={triggerRef}
        status={status}
        noAnimation={noAnimation}
        aria-haspopup="true"
        icon={icon}
        aria-expanded={isVisible}
        aria-controls="popover-content"
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
            className={classNames(styles["popover-content"])}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
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
