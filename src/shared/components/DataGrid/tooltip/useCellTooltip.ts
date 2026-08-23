import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** Vị trí + nội dung của tooltip đang hiển thị (toạ độ theo viewport) */
export type TooltipData = {
  content: string;
  /** Tâm ngang của ô đang hover */
  x: number;
  /** Mép trên của ô (khi placement = "top") hoặc mép dưới (khi "bottom") */
  y: number;
  placement: "top" | "bottom";
};

/** API tooltip dùng chung cho mọi ô — đưa qua GridContext */
export type TooltipController = {
  enabled: boolean;
  /** Hẹn giờ hiện tooltip cho một phần tử (chỉ gọi khi nội dung THẬT SỰ tràn) */
  show: (el: HTMLElement, content: string) => void;
  /** Huỷ hẹn giờ + ẩn tooltip đang hiện */
  hide: () => void;
  data: TooltipData | null;
};

/** Khoảng hở giữa tooltip và ô */
const GAP = 6;
/** Cần tối thiểu bằng này chỗ trống phía trên thì mới đặt tooltip lên trên */
const MIN_SPACE_ABOVE = 44;

/**
 * Quản lý một tooltip DUY NHẤT cho cả grid: hover ô nào thì ô đó hẹn giờ,
 * hết `delay` mới đo lại vị trí phần tử rồi hiện. Đo ở thời điểm hiện (không
 * phải lúc hover) để tooltip không lệch nếu grid vừa cuộn/đổi layout.
 */
export const useCellTooltip = (
  enabled: boolean,
  delay: number,
): TooltipController => {
  const [data, setData] = useState<TooltipData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearTimer();
    setData((prev) => (prev ? null : prev));
  }, [clearTimer]);

  const show = useCallback(
    (el: HTMLElement, content: string) => {
      if (!enabled || !content) return;
      clearTimer();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        // Ô có thể đã bị unmount/cuộn khuất trong lúc chờ delay
        if (!el.isConnected) return;
        const rect = el.getBoundingClientRect();
        const placement: TooltipData["placement"] =
          rect.top >= MIN_SPACE_ABOVE ? "top" : "bottom";
        setData({
          content,
          x: rect.left + rect.width / 2,
          y: placement === "top" ? rect.top - GAP : rect.bottom + GAP,
          placement,
        });
      }, delay);
    },
    [enabled, delay, clearTimer],
  );

  // Cuộn trang/đổi kích thước cửa sổ → tooltip thành "mồ côi", ẩn ngay
  useEffect(() => {
    if (!data) return;
    const onDismiss = () => hide();
    window.addEventListener("scroll", onDismiss, true);
    window.addEventListener("resize", onDismiss);
    return () => {
      window.removeEventListener("scroll", onDismiss, true);
      window.removeEventListener("resize", onDismiss);
    };
  }, [data, hide]);

  useEffect(() => clearTimer, [clearTimer]);

  return useMemo(
    () => ({ enabled, show, hide, data }),
    [enabled, show, hide, data],
  );
};
