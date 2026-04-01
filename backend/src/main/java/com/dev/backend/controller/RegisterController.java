package com.dev.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.bean.RegisterBean;
import com.dev.backend.entity.User;
import com.dev.backend.constant.RoleName;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.service.RegisterService;
import com.dev.backend.service.SendEmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
public class RegisterController {

    private final RegisterService registerService;
    private final JwtUtil jwtUtil;
    private final SendEmailService sendEmailService;

    @GetMapping("/resend-email")
    public ResponseEntity<ResponseData> get_verify_email(@RequestParam String verifyToken) {
        registerService.handleTokenForResend(verifyToken);
        return ResponseUtil.success("Đã gửi lại email xác thực", null);
    }

    @GetMapping("/register")
    public ResponseEntity<ResponseData> get_register(@RequestParam String verifyToken) {
        registerService.verifyRegister(verifyToken);
        return ResponseUtil.success("Xác thực thành công", null);
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseData> post_register(@RequestBody @Valid RegisterBean registerBean) {

        User user = registerService.register(registerBean, RoleName.CUSTOMER.name());
        if (user != null) {
            String verifyToken = jwtUtil.generateVerifyToken(user.getId());
            sendEmailService.sendEmailRegister(user.getEmail(),
                    "Cảm ơn bạn đã đăng ký tài khoản, vui lòng kích hoạt tài khoản", verifyToken);
        }
        return ResponseUtil.success("Đăng ký thành công vui lòng kiểm tra email để kích hoạt tài khoản", null);
    }

}
