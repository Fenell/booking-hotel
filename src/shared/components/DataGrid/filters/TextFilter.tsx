import { useState } from "react";
import { FILTER_DEBOUNCE_MS } from "../core/constants";
import { useGridContext } from "../core/gridContext";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import styles from "../styles/filters.module.css";

type TextFilterProps = { field: string; placeholder?: string };

/** Ô lọc text — operator "contains", debounce 400ms */
const TextFilter = ({ field, placeholder }: TextFilterProps) => {
  const ctx = useGridContext();
  const ctxValue = ctx.filterState[field]?.value ?? "";
  const [text, setText] = useState(ctxValue);

  const commit = useDebouncedCallback((value: string) => {
    ctx.setFilter(field, "contains", value);
  }, FILTER_DEBOUNCE_MS);

  // Đồng bộ khi filter đổi từ ngoài (ref.setFilter / clearAllFilters) —
  // pattern "adjust state during render" theo React docs.
  // cancel(): hủy commit đang chờ, tránh debounce "hồi sinh" filter vừa bị xóa.
  const [prevCtxValue, setPrevCtxValue] = useState(ctxValue);
  if (prevCtxValue !== ctxValue) {
    setPrevCtxValue(ctxValue);
    setText(ctxValue);
    commit.cancel();
  }

  return (
    <input
      className={styles.input}
      value={text}
      placeholder={placeholder ?? "Lọc..."}
      aria-label={`Lọc theo ${field}`}
      onChange={(e) => {
        setText(e.target.value);
        commit(e.target.value.trim());
      }}
    />
  );
};

export default TextFilter;
