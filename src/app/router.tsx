import Login from "@features/auth/Login";
import DashBoard from "@features/dashboard/page/DashBoard";
import IconPage from "@features/icon/page/IconPage";
import RoomPage from "@features/room/page/RoomPage";
import ServicePage from "@features/service/page/ServicePage";
import TypeRoomPage from "@features/typeRoom/page/TypeRoomPage";
import AuthLayout from "@layouts/AuthLayout";
import Root from "@layouts/RootLayout";
import ProtectedRoute from "@shared/components/Auth/ProtectedRoute";

import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Root />,
        children: [
          { index: true, element: <DashBoard /> },
          { path: "dashboard", element: <DashBoard /> },
          { path: "icon", element: <IconPage /> },
          { path: "service", element: <ServicePage /> },
          { path: "room-type", element: <TypeRoomPage /> },
          { path: "room", element: <RoomPage /> },
          // { path: "order", element: <Order /> },
          // { path: "sales", element: <Sales /> },
          // { path: "image", element: <Image /> },
          // { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);
