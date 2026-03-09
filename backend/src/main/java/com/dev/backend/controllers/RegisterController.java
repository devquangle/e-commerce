package com.dev.backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.beans.RegisterBean;
import com.dev.backend.entities.User;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.services.RegisterService;
import com.dev.backend.ultils.ResponseUtil;

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
            User u = registerService.register(registerBean);
            return ResponseUtil.success("register success", u);
        } catch (Exception e) {
            return ResponseUtil.error(e.getMessage(), null);
        }
    }

}
