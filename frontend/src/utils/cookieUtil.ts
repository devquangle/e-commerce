import Cookies from "js-cookie";

const TOKEN_KEY = "JWT_TOKEN";

// lưu token
export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    sameSite: "Lax",
    path: "/"
  });
};

// lấy token
export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

// xóa token
export const removeToken = () => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
};

