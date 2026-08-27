import { useId, type ReactNode } from "react";
import buttonStyle from "./Button.module.css";
import { motion, type HTMLMotionProps, type Variants } from "motion/react";
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

export type RawButtonProps = {
  /** Bộ màu của nút. Mặc định `"default"`. */
  status?: StatusBtn;
  /** Chuỗi class Font Awesome, ví dụ `"fa-regular fa-trash"`. */
  icon?: string | null;
  /** Tắt hiệu ứng hiện icon / trượt chữ khi rê chuột. */
  noAnimation?: boolean;
  small?: boolean;
  /** Đang xử lý: hiện spinner và **vô hiệu hoá thật sự** nút. */
  isLoading?: boolean;
  typeButton?: "outline";
  children?: ReactNode;
} & HTMLMotionProps<"button">;

/**
 * Spinner của nút. Không dùng `<defs>`/`id` nào để hai nút loading cùng lúc
 * không đụng id trong DOM; vòng xoay và màu đều do CSS module lo.
 */
const SpinnerIcon = () => (
  <svg
    className={buttonStyle["spinner"]}
    width="16"
    height="16"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="10"
      cy="10"
      r="8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="38 13"
    />
  </svg>
);

// Khai ở ngoài component: variant là hằng, không cần dựng lại mỗi lần render.
const ICON_VARIANTS: Variants = { hover: { opacity: 1 }, init: { opacity: 0 } };
const ICON_VARIANTS_STATIC: Variants = {
  hover: { opacity: 1 },
  init: { opacity: 1 },
};
const TEXT_VARIANTS: Variants = {
  hover: { right: 0 },
  init: { right: "10px" },
};
const TEXT_VARIANTS_STATIC: Variants = {
  hover: { right: 0 },
  init: { right: "0" },
};

const RawButton = ({
  children,
  status = "default",
  icon,
  small = false,
  noAnimation = false,
  typeButton,
  isLoading = false,
  disabled = false,
  type = "button",
  className,
  ...props
}: RawButtonProps) => {
  const iconVariants = noAnimation ? ICON_VARIANTS_STATIC : ICON_VARIANTS;
  const textVariants = noAnimation ? TEXT_VARIANTS_STATIC : TEXT_VARIANTS;

  return (
    <motion.button
      whileHover="hover"
      type={type}
      // Khoá thật bằng thuộc tính `disabled`: chỉ gắn class là vẫn bấm được
      // bằng Space/Enter và vẫn submit được form.
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={classNames(
        buttonStyle["button"],
        small && buttonStyle["small"],
        isLoading && buttonStyle["loading"],
        className,
      )}
      data-variant={status}
      data-type={typeButton || undefined}
      {...props}
    >
      {icon && (
        <motion.i
          aria-hidden="true"
          variants={iconVariants}
          initial="init"
          className={classNames(icon, !!children && buttonStyle["btn-icon"])}
        />
      )}
      {children && (
        <motion.span
          variants={textVariants}
          initial="init"
          className={buttonStyle["button-text"]}
        >
          {children}
        </motion.span>
      )}
      {/* Nội dung trên chỉ bị `visibility: hidden` khi loading nên nút giữ
          nguyên bề rộng, không làm nhảy layout. */}
      {isLoading && <SpinnerIcon />}
    </motion.button>
  );
};

export type ButtonProps = {
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
  const tooltipId = useId();
  const hasTooltip = showTooltip && !!tooltipContent;

  // Nút chỉ có icon thì không có tên khả truy cập — mượn nội dung tooltip
  // làm nhãn, trừ khi nơi gọi đã tự đặt `aria-label`.
  const ariaLabel =
    rawBtnProps["aria-label"] ??
    (!rawBtnProps.children && tooltipContent ? tooltipContent : undefined);

  const button = (
    <RawButton
      {...rawBtnProps}
      aria-label={ariaLabel}
      aria-describedby={
        hasTooltip
          ? classNames(rawBtnProps["aria-describedby"], tooltipId)
          : rawBtnProps["aria-describedby"]
      }
    />
  );

  if (!hasTooltip) return button;

  return (
    <Tooltip id={tooltipId} content={tooltipContent} position={tooltipPosition}>
      {button}
    </Tooltip>
  );
};

export default Button;
