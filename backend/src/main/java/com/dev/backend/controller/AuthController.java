package com.dev.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.bean.LoginBean;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;
import com.dev.backend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ResponseData> post_login(HttpServletResponse response,
            @RequestBody @Valid LoginBean loginBean) {

        Map<String, String> data = authService.login(loginBean, response);
        return ResponseUtil.success("Đăng nhập thành công", data);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ResponseData> post_refresh_token(HttpServletRequest request) {
        Map<String, String> data = authService.refreshToken(request);
        return ResponseUtil.success("Tạo token mới thành công", data);
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseData> post_logout(HttpServletResponse response) {
        authService.logout("refreshToken", response);
        return ResponseUtil.success("Đăng xuất thành công", null);
    }

}
