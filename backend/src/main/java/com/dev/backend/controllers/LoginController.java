package com.dev.backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.beans.LoginBean;
import com.dev.backend.entities.User;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.services.LoginService;
import com.dev.backend.ultils.CookieUtil;
import com.dev.backend.ultils.ResponseUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<ResponseData> login(HttpServletResponse response, @RequestBody LoginBean loginBean) {
        try {
            User user = loginService.login(loginBean);
            List<String> roles = user.getUserRoles().stream().map(ur -> ur.getRole().getName()).toList();
            String accessToken = jwtUtil.generateAccessToken(user.getId(), roles);
            String refreshToken = jwtUtil.generateRefreshToken(user.getId());
            CookieUtil.addCookie(response, "refreshToken", refreshToken);
            Map<String, String> data = Map.of("accessToken", accessToken);
            return ResponseUtil.success("Đăng nhập thành công", data);
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi đăng nhập " + e.getMessage(), null);
        }
    }

}
