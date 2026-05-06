
import { AuthContext } from "@/context/auth-context";
import type { User } from "@/types/user";
import { hasRoleAccess, type RoleType } from "@/types/role";
import { removeToken, setToken } from "@/utils/cookieUtil";
import { useEffect, useState } from "react";
import type { LoginRequest } from "@/types/auth";
import authService from "@/services/authService";
import { AUTH_STORAGE_KEY, TOKEN_KEY } from "@/constants/token";
import { showSuccessToast } from "@/utils/toastUtil";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    if (sessionStorage.getItem(AUTH_STORAGE_KEY.MANUAL_LOGOUT) === "1") {
      setUserInfo(null);
      setIsAuthenticated(false);
      setIsInitialized(true);
      return;
    }

    try {
      const user = await authService.getUser();

      setUserInfo(user);
      setIsAuthenticated(true);
    } catch {
      removeToken(TOKEN_KEY.ACCESS_TOKEN);
      setUserInfo(null);
      setIsAuthenticated(false);
    } finally {
      setIsInitialized(true);
    }
  };

  const login = async (request: LoginRequest) => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY.MANUAL_LOGOUT);
    const res = await authService.login(request);
    setToken(TOKEN_KEY.ACCESS_TOKEN, res.accessToken);
    const user = await authService.getUser();
    setUserInfo(user);
    setIsAuthenticated(true);
    return user;
  };

  const logout = async () => {


    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY.MANUAL_LOGOUT, "1");
      await authService.logout();
      showSuccessToast("Đăng xuất thành công");
    } catch {
      showSuccessToast("Đăng xuất thất bại");
    } finally {
      removeToken(TOKEN_KEY.ACCESS_TOKEN);
      setUserInfo(null);
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    }
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
