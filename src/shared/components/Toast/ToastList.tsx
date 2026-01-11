import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import toastStyle from "./Toast.module.css";
import Toast from "./Toast";
import classNames from "classnames";
import { useToastDispatch, useToastSelector } from "@app/store/hooks";
import { removeToast } from "@app/store/toast-slice";

type ToastListProps = {
  position?: "top-right" | "bottom-right" | "top-center";
};

const ToastList = ({ position = "top-right" }: ToastListProps) => {
  //Kiểm tra nếu Toast ở phía dưới thì đảo ngược list

  const dispatch = useToastDispatch();
  const listToast = useToastSelector((state) => state.toast.listToast);
  const sortedData = position.includes("bottom")
    ? [...listToast].reverse()
    : [...listToast];

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    const isTopPosition = ["top-left", "top-right"].includes(position);
    if (isTopPosition) {
      el?.scrollTo(0, el.scrollHeight);
    } else {
      el?.scrollTo(0, 0);
    }
  }, [position]);

  const handleRemoveToast = (id: string) => {
    dispatch(removeToast({ id }));
  };

  return (
    <AnimatePresence>
      {sortedData.length > 0 && (
        <motion.div
          exit={{ translateX: "100%" }}
          transition={{ duration: 0.5 }}
          // className={`toast-list toast-list--${position}`}
          className={classNames(
            toastStyle["toast-list"],
            toastStyle[`toast-list--${position}`]
          )}
          aria-live="assertive"
          ref={listRef}
        >
          <AnimatePresence>
            {listToast.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                onClose={() => handleRemoveToast(toast.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastList;
