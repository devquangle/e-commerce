import { getToken } from "@/utils/cookieUtil";

export const baseURL = "http://localhost:8080";
import axios from 'axios';

export const apiAuth = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiAuth.interceptors.request.use(
  (config) => {
    const token = getToken("JWT_TOKEN"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const apiGuest = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

