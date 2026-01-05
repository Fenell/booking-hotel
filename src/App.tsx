import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // children: [
    //   { index: true, element: <DashBoard /> },
    //   { path: "color", element: <Color /> },
    //   { path: "size", element: <Size /> },
    //   { path: "product", element: <Product /> },
    //   { path: "product-item", element: <ProductItem /> },
    //   { path: "order", element: <Order /> },
    //   { path: "sales", element: <Sales /> },
    //   { path: "image", element: <Image /> },
    //   { path: "*", element: <NotFound /> },
    // ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
