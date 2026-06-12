
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
import { useQuery, useQueryClient } from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      if (sessionStorage.getItem(AUTH_STORAGE_KEY.MANUAL_LOGOUT) === "1") {
        return null;
      }
      return await authService.getUser();
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading) {
      if (user && !isError) {
        setUserInfo(user);
        setIsAuthenticated(true);
      } else {
        removeToken(TOKEN_KEY.ACCESS_TOKEN);
        setUserInfo(null);
        setIsAuthenticated(false);
      }
      setIsInitialized(true);
    }
  }, [user, isLoading, isError]);

  const login = async (request: LoginRequest) => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY.MANUAL_LOGOUT);
    const res = await authService.login(request);
    setToken(TOKEN_KEY.ACCESS_TOKEN, res.accessToken);
    // Force React Query to fetch and cache new user data
    const fetchedUser = await queryClient.fetchQuery({
      queryKey: ["auth", "me"],
      queryFn: () => authService.getUser(),
    });
    setUserInfo(fetchedUser);
    setIsAuthenticated(true);
    return fetchedUser;
  };

  const logout = async () => {


    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY.MANUAL_LOGOUT, "1");
      await authService.logout();
      showSuccessToast("Đăng xuất thành công");
    } catch {
      showSuccessToast("Đăng xuất thất bại");
    } finally {
      queryClient.setQueryData(["auth", "me"], null);
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
