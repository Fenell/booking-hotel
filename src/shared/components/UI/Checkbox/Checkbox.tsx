import classNames from "classnames";
import checkBoxStyle from "./Checkbox.module.css";
import type { ChangeEvent, ComponentPropsWithoutRef } from "react";

type CheckboxProps = {
  isChecked: boolean;
  label: string;
  index?: string;
  value?: string | boolean | undefined;
  onChecked: (e: ChangeEvent<HTMLInputElement>) => void;
} & ComponentPropsWithoutRef<"input">;

const Checkbox = ({
  isChecked = false,
  label,
  index,
  value,
  onChecked,
  ...props
}: CheckboxProps) => {
  return (
    <div className={classNames(checkBoxStyle["checkbox-wrapper-4"])}>
      <input
        className={checkBoxStyle["inp-cbx"]}
        id={`${index}`}
        type="checkbox"
        value={value}
        checked={isChecked}
        onChange={onChecked}
        {...props}
      />
      <label className={checkBoxStyle["cbx"]} htmlFor={`${index}`}>
        <span>
          <svg width="12px" height="10px">
            <use xlinkHref="#check-4"></use>
          </svg>
        </span>
        {label && <span>{label}</span>}
      </label>
      <svg className={checkBoxStyle["inline-svg"]}>
        <symbol id="check-4" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </symbol>
      </svg>
    </div>
  );
};

export default Checkbox;
