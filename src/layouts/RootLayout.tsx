import Main from "@shared/components/Layout/Main/Main";
import NavBar from "@shared/components/Layout/Navbar/NavBar";
import SideNav from "@shared/components/Layout/SideNav/SideNav";
import ToastList from "@shared/components/Toast/ToastList";
import { Outlet } from "react-router";
import rootStyle from "./RootLayout.module.css";

const RootLayout = () => {
  return (
    <div className={rootStyle["root-layout"]}>
      <SideNav />
      <NavBar />
      <Main>
        <Outlet />
      </Main>
      <ToastList />
    </div>
  );
};

export default RootLayout;
