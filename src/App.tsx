import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "@app/router";
import { AppProvider } from "@app/provider";
import { AuthProvider } from "@shared/context/AuthContext";

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
