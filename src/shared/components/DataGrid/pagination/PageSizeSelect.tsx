import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import classNames from "classnames";
import { CheckIcon, ChevronDownIcon } from "../icons/icons";
import styles from "../styles/pager.module.css";

export type PageSizeSelectProps = {
  value: number;
  options: number[];
  onChange: (pageSize: number) => void;
};

/**
 * Combobox chọn cỡ trang — tự vẽ thay cho `<select>` native.
 *
 * Lý do không dùng select: phần menu xổ ra do trình duyệt/OS vẽ nên không theme
 * được theo token `--dg-*`, trong khi cả grid đã tự khép kín về giao diện.
 * Đổi lại phải tự lo ARIA (combobox + listbox) và điều hướng bàn phím.
 *
 * Danh sách xổ LÊN TRÊN vì pager nằm ở đáy grid; nó nằm trong `.root`
 * (`overflow: hidden`) nên phần vượt quá chiều cao grid sẽ bị cắt — CSS đã
 * chặn bằng `max-height` + cuộn.
 */
const PageSizeSelect = ({ value, options, onChange }: PageSizeSelectProps) => {
  const [open, setOpen] = useState(false);
  // Dòng đang được trỏ tới (chuột hoặc phím) — khác với dòng đang CHỌN (`value`)
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // Đưa focus vào listbox để nó nhận phím; đóng thì trả focus về nút.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const openList = useCallback(() => {
    setActiveIndex(Math.max(0, options.indexOf(value)));
    setOpen(true);
  }, [options, value]);

  const close = useCallback((focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  const choose = useCallback(
    (pageSize: number) => {
      onChange(pageSize);
      close();
    },
    [onChange, close],
  );

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openList();
    }
  };

  const handleListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(options[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        // Rời khỏi combobox thì đóng nhưng KHÔNG kéo focus về nút, để Tab đi tiếp
        setOpen(false);
        break;
    }
  };

  return (
    <div className={styles.sizeWrap} ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label="Số dòng mỗi trang"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        className={classNames(styles.sizeTrigger, {
          [styles.sizeTriggerOpen]: open,
        })}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{value}</span>
        <ChevronDownIcon size={12} className={styles.sizeChevron} />
      </button>

      {open && (
        <div
          id={listId}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-label="Số dòng mỗi trang"
          aria-activedescendant={`${listId}-opt-${activeIndex}`}
          className={styles.sizeList}
          onKeyDown={handleListKeyDown}
        >
          {options.map((size, index) => {
            const selected = size === value;
            return (
              <button
                key={size}
                id={`${listId}-opt-${index}`}
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={-1}
                className={classNames(styles.sizeOption, {
                  [styles.sizeOptionActive]: index === activeIndex,
                  [styles.sizeOptionSelected]: selected,
                })}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(size)}
              >
                <span className={styles.sizeCheck}>
                  {selected && <CheckIcon size={11} />}
                </span>
                {size}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageSizeSelect;
