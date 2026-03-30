package com.dev.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.bean.RegisterBean;
import com.dev.backend.entity.User;
import com.dev.backend.constant.RoleName;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;
import com.dev.backend.service.RegisterService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class RegisterController {

    private final RegisterService registerService;

    @PostMapping("/register")
    public ResponseEntity<ResponseData> register(@RequestBody RegisterBean registerBean) {

        try {
            User u = registerService.register(registerBean, RoleName.CUSTOMER.name());
            return ResponseUtil.success("register success", u);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi hệ thống", e);
        }
    }

}
