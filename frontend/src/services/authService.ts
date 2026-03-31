import type { LoginForm } from "@/types/login";
import type { RegisterFrom } from "@/types/register";
import axios from "axios";

const authService = {
  async login(data: LoginForm) {
    const res = await axios.post("http://localhost:8080/login", data);
    return res.data;
  },
  async register(data: RegisterFrom) {
    const res = await axios.post("http://localhost:8080/register", data);
    return res.data;
  },
};

export default authService;
