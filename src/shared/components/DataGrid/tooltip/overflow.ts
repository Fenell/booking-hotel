import type { MouseEvent } from "react";
import type { TooltipController } from "./useCellTooltip";

/** Nội dung có bị cắt bởi text-overflow: ellipsis không (trừ 1px sai số làm tròn) */
export const isOverflowing = (el: HTMLElement): boolean =>
  el.scrollWidth > el.clientWidth + 1;

/**
 * Cặp handler hover cho một phần tử có ellipsis. Trả undefined khi tắt tooltip
 * để React không gắn listener thừa lên hàng nghìn ô.
 */
export const overflowTooltipHandlers = (
  tooltip: TooltipController,
  enabled: boolean,
) => {
  if (!enabled || !tooltip.enabled) return undefined;
  return {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      if (!isOverflowing(el)) return;
      const text = (el.textContent ?? "").trim();
      if (text) tooltip.show(el, text);
    },
    onMouseLeave: () => tooltip.hide(),
  };
};
