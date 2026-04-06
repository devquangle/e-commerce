import { apiAuth, apiGuest } from "@/configs/api";
import type { LoginForm } from "@/types/login";
import type { RegisterFrom } from "@/types/register";
const authService = {
  async login(request: LoginForm) {
    const { data } = await apiGuest.post("/login", request);
    return data;
  },
  /** Trả envelope để lấy `message` khi backend không có payload (`data: null`). */
  async register(request: RegisterFrom) {
    const { data } = await apiGuest.post("/register", request);
    return data;
  },
  async getUser() {
    const { data } = await apiAuth.get("/auth/me");
    return data;
  }
};

export default authService;
