package com.dev.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.bean.LoginBean;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.service.LoginService;
import com.dev.backend.utils.ResponseUtil;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<ResponseData> login(HttpServletResponse response, @RequestBody @Valid LoginBean loginBean,
            BindingResult result) {

        try {
            if (result.hasErrors()) {
                return ResponseUtil.errorValidation("Lỗi xác thực", result);
            }
            Map<String, String> data = loginService.login(loginBean, response);
            return ResponseUtil.success("Đăng nhập thành công", data);
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi đăng nhập " + e.getMessage(), null);
        }
    }

}
