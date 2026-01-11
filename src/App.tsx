import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "@app/router";
import { AppProvider } from "@app/provider";

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
