import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "@app/router";
import { AppProvider } from "@app/provider";
import { AuthProvider } from "@shared/context/AuthContext";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import * as viLocale from "./assets/vi.json";

function App() {
  L10n.load(viLocale);
  setCulture("vi");

  return (
    <AppProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
