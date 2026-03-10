import { useEffect, useState, type ReactNode } from "react";

import type { User } from "@/types/user";
import { AuthContext } from "@/context/auth-context";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsInitialized(true);
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const user = await res.json();
        setUserInfo(user);
        setIsAuthenticated(true);
      }
    } finally {
      setIsInitialized(true);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem("token", token);

    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await res.json();

    setUserInfo(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
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