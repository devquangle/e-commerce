import type { LoginForm } from "@/types/login";
import axios from "axios";

const authService = {
  async login(data: LoginForm) {
    const res = await axios.post("http://localhost:8080/login", data);
    return res.data;
  },
};

export default authService;
