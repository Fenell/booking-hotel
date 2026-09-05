import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import tooltipStyle from "./Tooltip.module.css";

type Placement = "top" | "bottom";

type TooltipProps = {
  content?: string;
  /** Vị trí mong muốn. Không đủ chỗ thì tự lật sang phía kia. */
  position?: Placement;
  /** Id của phần nội dung tooltip, để phần tử con trỏ tới bằng `aria-describedby`. */
  id?: string;
  /** Trễ trước khi hiện khi rê chuột (ms). Focus bàn phím luôn hiện ngay. */
  delay?: number;
  children: ReactNode;
};

/** Khoảng hở giữa tooltip và phần tử neo */
const GAP = 6;
/** Cần tối thiểu bằng này chỗ trống phía trên thì mới đặt tooltip lên trên */
const MIN_SPACE_ABOVE = 44;
/** Chừa mép màn hình khi kẹp tooltip lại cho khỏi tràn */
const VIEWPORT_PADDING = 8;
const DEFAULT_DELAY = 300;

type TooltipPosition = { x: number; y: number; placement: Placement };

/**
 * Nhãn phụ cho một phần tử (thường là nút chỉ có icon).
 *
 * Render qua portal ra `body` với `position: fixed` — nằm trong cây DOM của
 * phần tử neo thì `overflow: hidden` của tổ tiên sẽ cắt mất, đó là lý do ô
 * lưới và thanh công cụ trước đây không dùng được tooltip.
 *
 * Chỉ dùng cho chuỗi ngắn không tương tác. Nội dung cần bấm/bôi đen thì dùng
 * `Popover`.
 */
const Tooltip = ({
  content,
  children,
  id,
  position = "top",
  delay = DEFAULT_DELAY,
}: TooltipProps) => {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tip, setTip] = useState<TooltipPosition | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearTimer();
    setTip((prev) => (prev ? null : prev));
  }, [clearTimer]);

  // Đo phần tử con thật chứ không đo lớp bọc: lớp bọc là `display: contents`
  // nên không có hộp, đo nó sẽ ra toàn số 0.
  const measure = useCallback((): TooltipPosition | null => {
    const anchor = anchorRef.current?.firstElementChild ?? anchorRef.current;
    if (!anchor?.isConnected) return null;

    const rect = anchor.getBoundingClientRect();
    const placement: Placement =
      position === "top" && rect.top < MIN_SPACE_ABOVE ? "bottom" : position;

    return {
      x: rect.left + rect.width / 2,
      y: placement === "top" ? rect.top - GAP : rect.bottom + GAP,
      placement,
    };
  }, [position]);

  const show = useCallback(() => {
    const next = measure();
    if (next) setTip(next);
  }, [measure]);

  // Rê chuột thì chờ hết `delay` mới đo lại rồi hiện — đo ở thời điểm hiện
  // (không phải lúc rê vào) để tooltip không lệch nếu trang vừa cuộn.
  const showAfterDelay = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      show();
    }, delay);
  }, [clearTimer, delay, show]);

  // Kẹp vào trong màn hình: bề rộng tuỳ nội dung nên chỉ đo được sau khi
  // render, bù bằng margin-left thẳng trên DOM để khỏi render lại lần nữa.
  useLayoutEffect(() => {
    const el = tipRef.current;
    if (!el) return;

    el.style.marginLeft = "0px";
    const rect = el.getBoundingClientRect();
    const max = window.innerWidth - VIEWPORT_PADDING;

    let shift = 0;
    if (rect.left < VIEWPORT_PADDING) shift = VIEWPORT_PADDING - rect.left;
    else if (rect.right > max)
      shift = Math.max(max - rect.right, VIEWPORT_PADDING - rect.left);

    el.style.marginLeft = `${shift}px`;
  }, [tip]);

  // Cuộn trang hoặc đổi kích thước cửa sổ thì tooltip thành "mồ côi", ẩn ngay
  useEffect(() => {
    if (!tip) return;

    const onDismiss = () => hide();
    window.addEventListener("scroll", onDismiss, true);
    window.addEventListener("resize", onDismiss);
    return () => {
      window.removeEventListener("scroll", onDismiss, true);
      window.removeEventListener("resize", onDismiss);
    };
  }, [tip, hide]);

  useEffect(() => clearTimer, [clearTimer]);

  if (!content) return children;

  return (
    <>
      <span
        ref={anchorRef}
        className={tooltipStyle.anchor}
        onMouseEnter={showAfterDelay}
        onMouseLeave={hide}
        // onFocus/onBlur nổi bọt từ phần tử con (React map sang focusin/focusout)
        // nên người dùng bàn phím cũng thấy được tooltip — và thấy ngay, không chờ.
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {tip &&
        createPortal(
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            className={classNames(
              tooltipStyle["tooltip-content"],
              tooltipStyle[tip.placement],
            )}
            style={{ left: tip.x, top: tip.y }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};

export default Tooltip;
