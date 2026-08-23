import classNames from "classnames";
import type { Header } from "@tanstack/react-table";
import styles from "../styles/header.module.css";

type ColumnResizerProps<T> = { header: Header<T, unknown> };

/** Tay kéo resize ở mép phải header (mouse + touch) */
const ColumnResizer = <T,>({ header }: ColumnResizerProps<T>) => (
  <div
    className={classNames(styles.resizer, {
      [styles.resizing]: header.column.getIsResizing(),
    })}
    onMouseDown={header.getResizeHandler()}
    onTouchStart={header.getResizeHandler()}
    onClick={(e) => e.stopPropagation()} // không kích hoạt sort khi kéo
    onDoubleClick={() => header.column.resetSize()}
  />
);

export default ColumnResizer;
