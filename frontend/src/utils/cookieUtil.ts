import Cookies from "js-cookie";


// lưu token
export const setToken = (name:string,value: string) => {
  Cookies.set(name, value, {
    expires: 7,
    sameSite: "Lax",
    path: "/"
  });
};

// lấy token
export const getToken = (tokenKey: string): string | undefined => {
  return Cookies.get(tokenKey);
};

// xóa token
export const removeToken = (tokenKey: string) => {
  Cookies.remove(tokenKey, { path: "/" });
};

