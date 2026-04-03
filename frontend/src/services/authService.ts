import { apiPublic } from "@/configs/api";
import type { LoginForm } from "@/types/login";
import type { RegisterFrom } from "@/types/register";

type LoginData = Record<string, string>;
const authService = {
  /** Payload đã được interceptor bóc từ ResponseData.data */
  async login(data: LoginForm) {
    return apiPublic.post<LoginData>("/login", data);
  },
  async register(data: RegisterFrom) {
    return apiPublic.post<unknown>("/register", data);
  },
};

export default authService;
