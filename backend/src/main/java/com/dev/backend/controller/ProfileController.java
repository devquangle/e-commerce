package com.dev.backend.controller;

import com.dev.backend.bean.ProfileBean;
import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.User;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;
import com.dev.backend.exception.UnauthorizedException;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final UserService userService;

    @GetMapping("/auth/me")
    public ResponseEntity<ResponseData<Object>> get_profile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new UnauthorizedException("User chưa đăng nhập");
        }

        User user = userDetails.getUser();

        Set<String> roles = new HashSet<>();
        Set<String> permissions = new HashSet<>();

        userDetails.getAuthorities().forEach(auth -> {
            String authority = auth.getAuthority();
            if (authority.startsWith("ROLE_")) {
                roles.add(authority.substring(5));
            } else {
                permissions.add(authority);
            }
        });

        UserDTO userDTO = UserDTO.builder()
                .code(user.getCode())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .image(user.getImage())
                .roles(roles)
                .permissions(permissions)
                .build();

        return ResponseUtil.success("Lấy thông tin người dùng thành công", userDTO);
    }

    @PostMapping("/auth/me")
    public ResponseEntity<ResponseData<Object>> post_profile(@RequestPart("profile") ProfileBean profileBean,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UserDTO userDTO = userService.updateProfile(profileBean, userDetails);

        return ResponseUtil.success("Cập nhật hồ sơ thành công", userDTO);
    }

}
