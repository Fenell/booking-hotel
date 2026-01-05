import type { ReactNode } from "react";
import mainStyle from "./Main.module.css";

type MainContentProps = {
  children: ReactNode;
};

function MainContent({ children }: MainContentProps) {
  return <div className={mainStyle["main-content"]}>{children}</div>;
}

export default MainContent;
