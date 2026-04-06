import { createContext } from "react";
import type { User } from "@/types/user";
import type { RoleType } from "@/types/role";
import type { LoginForm } from "@/types/login";

export interface AuthContextType {
  userInfo: User | null;
  setUserInfo: (userInfo: User | null) => void;
  isAuthenticated: boolean;
  isInitialized: boolean;

  login: (request:LoginForm) =>Promise<User|null>;
  logout: () => void;
  hasRole: (role: RoleType) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);