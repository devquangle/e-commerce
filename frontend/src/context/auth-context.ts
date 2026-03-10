import { createContext } from "react";
import type { User } from "@/types/user";

export interface AuthContextType {
  userInfo: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;

  login: (token: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);