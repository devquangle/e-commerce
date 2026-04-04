import { apiGuest} from "@/configs/api";
import type { LoginForm } from "@/types/login";
import type { RegisterFrom } from "@/types/register";
const authService = {
  /** Payload đã được interceptor bóc từ ResponseData.data */
  async login(request: LoginForm) {
    return apiGuest.post("/login", request);
  },
  /** Trả envelope để lấy `message` khi backend không có payload (`data: null`). */
  async register(request: RegisterFrom) {
    return apiGuest.post("/register", request);
  },
};

export default authService;
