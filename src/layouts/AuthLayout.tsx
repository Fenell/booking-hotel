import { Outlet } from "react-router";
import authLayoutStyle from "./AuthLayout.module.css";
import ToastList from "@shared/components/Toast/ToastList";

const AuthLayout = () => {
  return (
    <div className={authLayoutStyle["login-container"]}>
      <Outlet />
      <ToastList />
    </div>
  );
};

export default AuthLayout;
