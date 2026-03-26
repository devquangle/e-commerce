import api from "@/configs/api";
import { AuthContext } from "@/context/auth-context";
import type { User } from "@/types/user";
import { hasRoleAccess, type RoleType } from "@/types/role";
import { getToken, removeToken, setToken } from "@/utils/cookieUtil";
import { useEffect, useState } from "react";

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

    const token = getToken("JWT_TOKEN");

    if (!token) {
      setIsInitialized(true);
      return;
    }

    try {

      const res = await api.get("/auth/me");

      const user = res.data.data;

      setUserInfo(user);
      setIsAuthenticated(true);

    } catch {

      removeToken("JWT_TOKEN");

    } finally {

      setIsInitialized(true);

    }
  };

  const login = async (token: string) => {

    setToken("JWT_TOKEN", token);

    const res = await api.get("/auth/me");

    const user = res.data.data;

    setUserInfo(user);
    setIsAuthenticated(true);

    return user;
  };

  const logout = () => {

    removeToken("JWT_TOKEN");
    setUserInfo(null);
    setIsAuthenticated(false);
    setIsInitialized(true);
   
  };

const hasRole = (requiredRole: RoleType) => {
  const userRoles = userInfo?.roles ?? [];
  return hasRoleAccess(userRoles, requiredRole);
};

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isAuthenticated,
        isInitialized,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};