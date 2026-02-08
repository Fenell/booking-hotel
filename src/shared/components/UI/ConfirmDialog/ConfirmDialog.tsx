import Button from "../Button/Button";
import { createRoot, type Root } from "react-dom/client";
import dialogStyle from "./ConfirmDialog.module.css";
import { motion } from "motion/react";
import classNames from "classnames";

type Props = {
  title?: string;
  text: string;
  options?: {
    falseButtonText?: string;
    trueButtonText?: string;
  };
};

type ConfirmDialogProps = Props & {
  onClose: (answer: boolean) => void;
};

const ConfirmDialog = ({
  title,
  text,
  options,
  onClose,
}: ConfirmDialogProps) => {
  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    hiddenBackDrop: { opacity: 0 },
    visibleBackDrop: { opacity: 1 },
  };

  const handleKeyDown = () => {};

  return (
    <motion.div
      variants={variants}
      initial="hiddenBackDrop"
      animate="visibleBackDrop"
      exit="hiddenBackDrop"
      className={dialogStyle.backdrop}
      // onClick={handleCloseModal}
    >
      <motion.dialog
        open
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={classNames(dialogStyle.alertDialog)}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={dialogStyle["modal-header"]}>
          <p className={dialogStyle["modal-title"]}>{title}</p>
          {/* <button
            className={dialogStyle["modal-close-btn"]}
            onClick={handleCloseModal}
          >
            <i className="fa-regular fa-xmark fa-lg"></i>
          </button> */}
        </div>
        <div className={dialogStyle["modal-content"]}>{text}</div>
        <div className={dialogStyle["modal-footer"]}>
          <Button
            onClick={() => onClose(false)}
            noAnimation
            small
            status="dark"
          >
            {options?.falseButtonText ?? "Đóng"}
          </Button>
          <Button
            onClick={() => onClose(true)}
            noAnimation
            small
            status="success"
          >
            {options?.trueButtonText ?? "Đồng ý"}
          </Button>
        </div>
      </motion.dialog>
    </motion.div>
  );
};

export const customConfirm = ({
  title,
  text,
  options,
}: Props): Promise<boolean> => {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root: Root = createRoot(container);
    const handleClose = (answer: boolean) => {
      resolve(answer);

      root.unmount();
      container.remove();
    };

    root.render(
      <ConfirmDialog
        title={title}
        text={text}
        options={options}
        onClose={handleClose}
      />,
    );
  });
};
