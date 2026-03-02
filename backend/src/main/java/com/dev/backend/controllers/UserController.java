package com.dev.backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.beans.RegisterBean;
import com.dev.backend.entities.User;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.services.RegisterService;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class UserController {

    @Autowired
    private RegisterService registerService;

    @PostMapping("/register")
    public ResponseEntity<ResponseData> dangky(@RequestBody RegisterBean registerBean) {
        ResponseData rp = new ResponseData();
        try {
            User u = registerService.dangky(registerBean);
            rp.setSuccess(true);
            rp.setMessage("pass");
            rp.setData(u);

            return ResponseEntity.ok(rp);
        } catch (Exception e) {
            rp.setSuccess(false);
            rp.setMessage("Lỗi " + e.getMessage());
            rp.setData(null);
            rp.setTimestamp(LocalDateTime.now());
            return ResponseEntity.badRequest().body(rp);
        }
    }

}
