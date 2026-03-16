import { createContext } from "react";
import type { User } from "@/types/user";
import type { RoleType } from "@/types/role";

export interface AuthContextType {
  userInfo: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  login: (token: string) => Promise<User | null>;
  logout: () => void;
  hasRole: (role: RoleType) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);