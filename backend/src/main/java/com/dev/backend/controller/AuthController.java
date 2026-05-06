package com.dev.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.auth.LoginRequest;
import com.dev.backend.dto.auth.LoginResponse;
import com.dev.backend.dto.auth.RefreshResponse;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;
import com.dev.backend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ResponseData<LoginResponse>> post_login(HttpServletResponse response,
            @RequestBody @Valid LoginRequest loginRequest) {

        LoginResponse loginResponse = authService.login(loginRequest, response);
        return ResponseUtil.success("Đăng nhập thành công", loginResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ResponseData<RefreshResponse>> post_refresh_token(HttpServletRequest request) {
        RefreshResponse data = authService.refreshToken(request);
        return ResponseUtil.success("Tạo token mới thành công", data);
    }

    @GetMapping("/logout")
    public ResponseEntity<ResponseData<Object>> post_logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseUtil.success("Đăng xuất thành công", null);
    }

}
