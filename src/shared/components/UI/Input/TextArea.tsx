import type { ComponentPropsWithoutRef } from "react";
import styles from "./Input.module.css";

type TextAreaProps = {} & ComponentPropsWithoutRef<"textarea">;

const TextArea = ({ ...props }: TextAreaProps) => {
  return <textarea className={styles["text-area-custom"]} {...props} />;
};

export default TextArea;
