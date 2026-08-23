import { useEffect, useRef, useState } from "react";
import type { Table } from "@tanstack/react-table";
import classNames from "classnames";
import { useGridContext } from "../core/gridContext";
import { CheckIcon, ColumnsIcon } from "../icons/icons";
import bodyStyles from "../styles/body.module.css";
import styles from "../styles/chooser.module.css";

type ColumnChooserProps<T> = { table: Table<T> };

/** Dropdown ẩn/hiện cột — tự vẽ, tự xử lý click-outside */
const ColumnChooser = <T,>({ table }: ColumnChooserProps<T>) => {
  const ctx = useGridContext<T>();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const columns = table.getAllLeafColumns().filter((c) => c.getCanHide());

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <ColumnsIcon />
        Cột
      </button>
      {open && (
        <div className={styles.panel} role="menu">
          {columns.map((column) => {
            const visible = column.getIsVisible();
            const label = ctx.colDefFor(column.id)?.headerText ?? column.id;
            return (
              <button
                key={column.id}
                type="button"
                role="menuitemcheckbox"
                aria-checked={visible}
                className={styles.item}
                onClick={() => column.toggleVisibility()}
              >
                <span
                  className={classNames(bodyStyles.checkbox, {
                    [bodyStyles.checkboxChecked]: visible,
                  })}
                >
                  {visible && <CheckIcon size={11} />}
                </span>
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ColumnChooser;
