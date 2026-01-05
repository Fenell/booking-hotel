import NavBar from "@components/Navbar/NavBar";
import SideBar from "../components/Sidebar/SideBar";
import { Outlet } from "react-router";
import Main from "@components/Main/Main";

const Root = () => {
  return (
    <>
      <SideBar />
      <NavBar />
      <Main>
        <Outlet />
      </Main>
      {/* <ToastList /> */}
    </>
  );
};

export default Root;
