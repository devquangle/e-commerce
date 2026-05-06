package com.dev.backend.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtil {

    private static final int EXPIRE_7_DAYS = 60 * 60 * 24 * 7;

    private static final String PATH = "/";
    private static final boolean HTTP_ONLY = true;
    private static final boolean SECURE = false; // localhost = false, HTTPS = true

    // SET COOKIE
    public static void addCookie(HttpServletResponse response, String name, String value) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath(PATH);
        cookie.setHttpOnly(HTTP_ONLY);
        cookie.setSecure(SECURE);
        cookie.setMaxAge(EXPIRE_7_DAYS);

        response.addCookie(cookie);
    }

    // GET COOKIE
    public static String getCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(name)) {
                return cookie.getValue();
            }
        }
        return null;
    }

    // DELETE COOKIE (QUAN TRỌNG)
    public static void deleteCookie(HttpServletResponse response, String name) {
        Cookie cookie = new Cookie(name, "");
        cookie.setPath(PATH);
        cookie.setHttpOnly(HTTP_ONLY);
        cookie.setSecure(SECURE); // ⚠️ phải giống lúc set
        cookie.setMaxAge(0);

        response.addCookie(cookie);
    }
}