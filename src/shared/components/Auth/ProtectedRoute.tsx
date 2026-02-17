import { useAuthContext } from "@shared/context/AuthContext";
import { Navigate, Outlet } from "react-router";
import Spinner from "../Spinner/Spinner";

const ProtectedRoute = () => {
  const context = useAuthContext();
  // console.log("ProtectedRoute context", context);
  // console.log("ProtectedRoute render:", context.authenticated);
  // console.log(context.authenticated);

  if (!context.authenticated) {
    return <Navigate to="/login" replace />;
  }
  if (context.loading) {
    return <Spinner />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
