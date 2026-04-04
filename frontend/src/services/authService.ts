import { apiPublic, postPublicEnvelope } from "@/configs/api";
import type { LoginForm } from "@/types/login";
import type { RegisterFrom } from "@/types/register";
type LoginData = Record<string, string>;
const authService = {
  /** Payload đã được interceptor bóc từ ResponseData.data */
  async login(data: LoginForm) {
    return apiPublic.post<LoginData>("/login", data);
  },
  /** Trả envelope để lấy `message` khi backend không có payload (`data: null`). */
  async register(data: RegisterFrom) {
    return postPublicEnvelope<unknown>("/register", data);
  },
};

export default authService;
