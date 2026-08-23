import classNames from "classnames";
import styles from "../styles/body.module.css";
import { CheckIcon, MinusIcon } from "../icons/icons";

type SelectionCheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onToggle: () => void;
  ariaLabel: string;
};

/** Checkbox tự vẽ (button + SVG) — không dùng input/label để né trùng id, không phụ thuộc CSS ngoài */
const SelectionCheckbox = ({
  checked,
  indeterminate,
  onToggle,
  ariaLabel,
}: SelectionCheckboxProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={indeterminate ? "mixed" : checked}
    aria-label={ariaLabel}
    className={classNames(styles.checkbox, {
      [styles.checkboxChecked]: checked || indeterminate,
    })}
    onClick={(e) => {
      e.stopPropagation(); // không kích hoạt onRowClick
      onToggle();
    }}
  >
    {indeterminate ? <MinusIcon size={11} /> : checked ? <CheckIcon size={11} /> : null}
  </button>
);

export default SelectionCheckbox;
