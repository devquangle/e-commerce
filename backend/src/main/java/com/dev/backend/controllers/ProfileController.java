package com.dev.backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.resp.ResponseData;
import com.dev.backend.services.UserService;
import com.dev.backend.ultils.ResponseUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;


@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final UserService userService;
    @GetMapping("/auth")
    public ResponseEntity<ResponseData> profile(@RequestHeader("Authorization") String token) {
      try {

          return ResponseUtil.success("get user success", userService.getUserDTO(token));
      } catch (Exception e) {
         return ResponseUtil.error("register success", null);
      }
    }
    
}
