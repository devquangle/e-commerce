package com.dev.backend.controller;

import com.dev.backend.bean.ProfileBean;
import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.User;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;

import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.service.AuthService;
import com.dev.backend.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    @GetMapping("/auth/me")
    public ResponseEntity<ResponseData> get_profile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserDTO userDTO = userService.dto(userDetails);
        return ResponseUtil.success("Lấy thông tin người dùng thành công", userDTO);
    }

    @PostMapping("/auth/me")
    public ResponseEntity<ResponseData> post_profile(@RequestPart("profile") ProfileBean profileBean,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserDTO userDTO = userService.updateProfile(userDetails, profileBean, image);

        return ResponseUtil.success("Cập nhật hồ sơ thành công", userDTO);
    }

}
