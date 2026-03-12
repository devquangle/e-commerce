import axios from "axios";
import Cookies from "js-cookie";

const TOKEN_KEY = "accessToken";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// request → gắn token
api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);
  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// response → lưu token vào cookie
api.interceptors.response.use((response) => {
  const token = response?.data?.token;

  if (token) {
    Cookies.set(TOKEN_KEY, token);
  }

  return response;
});

export default api;
