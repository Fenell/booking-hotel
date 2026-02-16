import Spinner from "@shared/components/Spinner/Spinner";
import { getAccessToken, setAccessToken } from "@shared/services/auth.service";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);

    const currentTime = Date.now() / 1000; // đổi ms → giây    console.log(currentTime);

    return decoded.exp < currentTime;
  } catch (error) {
    console.log(JSON.stringify(error));
    return true; // nếu decode lỗi coi như expired
  }
};

type AuthContextType = {
  authenticated: boolean;
  loading: boolean;
  onLogin: (token: string) => void;
};
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useKeycloak must be used within a KeycloakProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log("AuthContext file loaded");

  useEffect(() => {
    const token = getAccessToken();
    // console.log(token);
    if (token && !isTokenExpired(token)) {
      console.log("oke");
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  const handleLogin = (token: string) => {
    console.log("oke");
    setAccessToken(token);
    setAuthenticated(true);
  };

  const value: AuthContextType = {
    authenticated,
    loading,
    onLogin: handleLogin,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
