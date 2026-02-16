import Main from "@shared/components/Layout/Main/Main";
import NavBar from "@shared/components/Layout/Navbar/NavBar";
import SideBar from "@shared/components/Layout/Sidebar/SideBar";
import ToastList from "@shared/components/Toast/ToastList";
import { Outlet } from "react-router";
import rootStyle from "./RootLayout.module.css";

const RootLayout = () => {
  return (
    <div className={rootStyle["root-layout"]}>
      <SideBar />
      <NavBar />
      <Main>
        <Outlet />
      </Main>
      <ToastList />
    </div>
  );
};

export default RootLayout;
