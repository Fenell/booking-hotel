import DashBoard from "@features/dashboard/page/DashBoard";
import IconPage from "@features/icon/page/IconPage";
import Root from "@layouts/Root";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <DashBoard /> },
      { path: "icon", element: <IconPage /> },
      // { path: "size", element: <Size /> },
      // { path: "product", element: <Product /> },
      // { path: "product-item", element: <ProductItem /> },
      // { path: "order", element: <Order /> },
      // { path: "sales", element: <Sales /> },
      // { path: "image", element: <Image /> },
      // { path: "*", element: <NotFound /> },
    ],
  },
]);
