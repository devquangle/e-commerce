import { apiAuth,  } from "@/configs/axios";
import { AuthContext } from "@/context/auth-context";
import type { User } from "@/types/user";
import { hasRoleAccess, type RoleType } from "@/types/role";
import { getToken, removeToken, setToken } from "@/utils/cookieUtil";
import { useEffect, useState } from "react";
import type { LoginForm } from "@/types/login";
import authService from "@/services/authService";

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
      const { data } = await apiAuth.get("/auth/me");

      setUserInfo(data?.data);
      setIsAuthenticated(true);
    } catch {
      removeToken("JWT_TOKEN");
    } finally {
      setIsInitialized(true);
    }
  };

  const login = async (request: LoginForm) => {
    const respLogin = await authService.login(request);
    if (!respLogin.success) {
      return null;
    }
   

    setToken("JWT_TOKEN", respLogin?.data?.accessToken);

    const respAuth = await authService.getUser();
    if (!respAuth.success) {
      return;
    }
    setUserInfo(respAuth?.data);
    setIsAuthenticated(true);

    return respAuth.data;
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
        setUserInfo,
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
