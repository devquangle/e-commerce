import { apiAuth, apiGuest } from "@/configs/axios";
import type { ApiResponse } from "@/types/api-response";
import type { LoginRequest, LoginResponse } from "@/types/auth";
import type { RegisterFrom } from "@/types/register";
import type { User } from "@/types/user";
const authService = {
  async logout() {
    try {
      await apiGuest.post("/logout", null);
    } catch (error) {
      console.warn("Logout API error:", error);
    }
  },

  async login(request: LoginRequest) {
    const res = await apiGuest.post<ApiResponse<LoginResponse>>(
      "/login",
      request,
    );
    if (!res.data.success || !res.data.data) {
      throw new Error(res.data.message || "Login failed");
    }

    return res.data.data;
  },

  async register(request: RegisterFrom) {
    const { data } = await apiGuest.post<ApiResponse<null>>(
      "/register",
      request,
    );
    return data;
  },
  async getUser() {
    try {
      const res = await apiAuth.get<ApiResponse<User>>("/auth/me");

      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || "Get user failed");
      }

      return res.data.data;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Network error");
    }
  },
};

export default authService;
