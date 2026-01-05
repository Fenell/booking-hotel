import { type ReactNode } from "react";
import mainStyle from "./Main.module.css";

type HeaderContentProps = {
  children: ReactNode;
};

function HeaderContent({ children }: HeaderContentProps) {
  return <div className={mainStyle["header-content"]}>{children}</div>;
}

export default HeaderContent;
