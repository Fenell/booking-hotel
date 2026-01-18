import classNames from "classnames";
import checkBoxStyle from "./Checkbox.module.css";

type CheckboxProps = {
  isChecked: boolean;
  label: string;
  index?: number;
  value: string;
  onChecked: () => void;
};

const Checkbox = ({
  isChecked = false,
  label,
  index,
  value,
  onChecked,
}: CheckboxProps) => {
  return (
    <div className={classNames(checkBoxStyle["checkbox-wrapper-4"])}>
      <input
        className={checkBoxStyle["inp-cbx"]}
        id={`checkbox-${index}`}
        type="checkbox"
        value={value}
        checked={isChecked}
        onChange={onChecked}
      />
      <label className={checkBoxStyle["cbx"]} htmlFor={`checkbox-${index}`}>
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
