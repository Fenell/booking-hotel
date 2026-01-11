import type { ComponentPropsWithoutRef, ReactNode } from "react";
import mainStyle from "./Main.module.css";

type MainProps = {
  children: ReactNode;
} & ComponentPropsWithoutRef<"main">;

const Main = ({ children, ...prop }: MainProps) => {
  return (
    <main className={mainStyle["main"]} {...prop}>
      <div className={mainStyle["container"]}>
        {/* <Breadcrumb /> */}
        <section>{children}</section>
      </div>
    </main>
  );
};

export default Main;
