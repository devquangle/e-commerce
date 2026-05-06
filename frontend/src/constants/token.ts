export const TOKEN_KEY = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const AUTH_STORAGE_KEY = {
  MANUAL_LOGOUT: "manualLogout",
} as const;

export const AUTH_ENDPOINT = {
  REFRESH_TOKEN: "/refresh-token",
} as const;
