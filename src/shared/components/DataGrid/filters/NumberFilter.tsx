import { useState } from "react";
import { FILTER_DEBOUNCE_MS, NUMBER_OPERATOR_LABELS } from "../core/constants";
import { useGridContext } from "../core/gridContext";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import styles from "../styles/filters.module.css";
import type { NumberOperator } from "../types/column";

type NumberFilterProps = { field: string; operators?: NumberOperator[] };

const ALL_OPERATORS: NumberOperator[] = ["eq", "gt", "lt"];

/** Ô lọc số — chọn toán tử =, >, < + debounce 400ms */
const NumberFilter = ({ field, operators }: NumberFilterProps) => {
  const ctx = useGridContext();
  const ops = operators?.length ? operators : ALL_OPERATORS;
  const ctxFilter = ctx.filterState[field];
  const ctxValue = ctxFilter?.value ?? "";
  const ctxOperator = ctxFilter?.operator;
  const [operator, setOperator] = useState<NumberOperator>(
    (ctxOperator as NumberOperator) ?? ops[0],
  );
  const [text, setText] = useState(ctxValue);

  const commit = useDebouncedCallback((op: string, value: string) => {
    ctx.setFilter(field, op, value);
  }, FILTER_DEBOUNCE_MS);

  // Đồng bộ value + operator khi filter đổi từ ngoài (ref.setFilter/clearAllFilters)
  const [prevCtxValue, setPrevCtxValue] = useState(ctxValue);
  if (prevCtxValue !== ctxValue) {
    setPrevCtxValue(ctxValue);
    setText(ctxValue);
    commit.cancel();
  }
  const [prevCtxOperator, setPrevCtxOperator] = useState(ctxOperator);
  if (prevCtxOperator !== ctxOperator) {
    setPrevCtxOperator(ctxOperator);
    // filter bị xóa (undefined) thì giữ nguyên lựa chọn toán tử hiện tại
    if (ctxOperator) setOperator(ctxOperator as NumberOperator);
  }

  /** Chỉ phát filter khi chuỗi là số hợp lệ (hoặc rỗng = gỡ filter) — chặn "1.2.3", "5-" */
  const commitIfValid = (op: string, value: string) => {
    if (value === "" || Number.isFinite(Number(value))) commit(op, value);
  };

  return (
    <div className={styles.filterBox}>
      <select
        className={styles.opSelect}
        value={operator}
        aria-label={`Toán tử lọc ${field}`}
        onChange={(e) => {
          const op = e.target.value as NumberOperator;
          setOperator(op);
          if (text) commitIfValid(op, text.trim()); // đổi toán tử khi đã có giá trị → lọc lại
        }}
      >
        {ops.map((op) => (
          <option key={op} value={op}>
            {NUMBER_OPERATOR_LABELS[op]}
          </option>
        ))}
      </select>
      <input
        className={styles.input}
        value={text}
        inputMode="decimal"
        placeholder="Lọc..."
        aria-label={`Lọc theo ${field}`}
        onChange={(e) => {
          const value = e.target.value.replace(/[^\d.-]/g, "");
          setText(value);
          commitIfValid(operator, value.trim());
        }}
      />
    </div>
  );
};

export default NumberFilter;
