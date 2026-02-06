import classNames from "classnames";
import inputStyle from "./Input.module.css";
import type { ComponentPropsWithoutRef } from "react";

type InputProps = {
  smallType?: boolean;
} & ComponentPropsWithoutRef<"input">;

const Input = ({ smallType = false, ...props }: InputProps) => {
  return (
    <>
      <div style={{ position: "relative" }}>
        <input
          className={classNames(
            inputStyle["input-custom"],
            smallType && inputStyle["smallType"],
          )}
          onFocus={(e) => e.target.select()}
          {...props}
          //value={field.value || ""}
        />
      </div>
    </>
  );
};

export default Input;
