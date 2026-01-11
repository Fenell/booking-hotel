import Main from "@shared/components/Layout/Main/Main";
import NavBar from "@shared/components/Layout/Navbar/NavBar";
import SideBar from "@shared/components/Layout/Sidebar/SideBar";
import ToastList from "@shared/components/Toast/ToastList";
import { Outlet } from "react-router";

const Root = () => {
  return (
    <>
      <SideBar />
      <NavBar />
      <Main>
        <Outlet />
      </Main>
      <ToastList />
    </>
  );
};

export default Root;
