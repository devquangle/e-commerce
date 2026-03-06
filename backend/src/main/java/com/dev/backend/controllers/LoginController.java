package com.dev.backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.beans.LoginBean;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.services.LoginService;
import com.dev.backend.ultils.ResponseUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<ResponseData> login(@RequestBody LoginBean loginBean) {
        try {
           String token = loginService.login(loginBean);
            
            return ResponseUtil.success("Đăng nhập thành công",token);
        } catch (Exception e) {
          return ResponseUtil.error("Lỗi đăng nhập " + e.getMessage(), null);
        }
    }

}
