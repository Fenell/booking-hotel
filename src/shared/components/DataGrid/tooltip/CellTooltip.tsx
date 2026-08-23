import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import styles from "../styles/tooltip.module.css";
import type { TooltipData } from "./useCellTooltip";

/** Chừa mép màn hình khi kẹp tooltip lại cho khỏi tràn */
const VIEWPORT_PADDING = 8;

/**
 * Tooltip DUY NHẤT của grid, render qua portal ra body — grid gốc có
 * `overflow: hidden` nên tooltip nằm trong cây DOM của grid sẽ bị cắt.
 * Vì ở ngoài `.root`, mọi màu sắc/kích thước ở đây tự khai báo, không đọc token --dg-*.
 */
const CellTooltip = ({ data }: { data: TooltipData }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Kẹp vào trong màn hình: bề rộng tuỳ nội dung nên chỉ đo được sau khi render,
  // bù bằng margin-left thẳng trên DOM — không setState để khỏi render lại.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.marginLeft = "0px"; // về vị trí gốc trước khi đo lại
    const rect = el.getBoundingClientRect();
    const max = window.innerWidth - VIEWPORT_PADDING;
    let shift = 0;
    if (rect.left < VIEWPORT_PADDING) shift = VIEWPORT_PADDING - rect.left;
    else if (rect.right > max)
      shift = Math.max(max - rect.right, VIEWPORT_PADDING - rect.left);
    el.style.marginLeft = `${shift}px`;
  }, [data]);

  return createPortal(
    <div
      ref={ref}
      role="tooltip"
      className={classNames(styles.tooltip, {
        [styles.top]: data.placement === "top",
        [styles.bottom]: data.placement === "bottom",
      })}
      style={{ left: data.x, top: data.y }}
    >
      {data.content}
    </div>,
    document.body,
  );
};

export default CellTooltip;
