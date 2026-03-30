package com.dev.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.bean.RegisterBean;
import com.dev.backend.entity.User;
import com.dev.backend.constant.RoleName;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;
import com.dev.backend.service.RegisterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class RegisterController {

    private final RegisterService registerService;

    @PostMapping("/register")
    public ResponseEntity<ResponseData> register(@RequestBody @Valid RegisterBean registerBean) {

        User user = registerService.register(registerBean, RoleName.CUSTOMER.name());
        if (user != null) {
            // tạo token để kích hoạt tài khoản
            // Gửi email kích hoạt tài khoản
            // Trả về thông báo thành công

        }
        return ResponseUtil.success("Đăng ký thành công vui lòng kiểm tra email để kích hoạt tài khoản", null);
    }

}
