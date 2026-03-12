import api from "@/config/api";
import { AuthContext } from "@/context/auth-context";
import type { User } from "@/types/user";
import { getToken, removeToken, setToken } from "@/utils/cookieUtil";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
type Props = {
  children: React.ReactNode;
};
export const AuthProvider = ({ children }: Props) => {

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {

    const token = getToken();

    if (!token) {
      setIsInitialized(true);
      return;
    }

    try {

      const res = await api.get("/auth/me");
      console.log("Auth init response:", res.data);

      setUserInfo(res.data.data);
      setIsAuthenticated(true);
      console.log("User info:", res.data.data);

    } catch {

      removeToken();

    } finally {

      setIsInitialized(true);

    }
  };

  const login = async (token: string) => {
     setToken(token);
    const res = await api.get("/auth/me");

    setUserInfo(res.data.data);
    setIsAuthenticated(true);

  };

  const logout = () => {

    removeToken();
    setUserInfo(null);
    setIsAuthenticated(false);

  };

  const hasRole = (role: string) => {
    return userInfo?.roles?.includes(role) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isAuthenticated,
        isInitialized,
        login,
        logout,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};