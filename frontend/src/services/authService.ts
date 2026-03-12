import axios from "axios";

const authService = {
  async login(data: { email: string; password: string }) {
    const res = await axios.post("http://localhost:8080/login", data);
    return res.data;
  },
};

export default authService;