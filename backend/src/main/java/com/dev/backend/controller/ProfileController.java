package com.dev.backend.controller;

import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.User;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.util.ResponseUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    @GetMapping("/auth/me")
    public ResponseEntity<ResponseData> get_profile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseUtil.error("User not authenticated", null);
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

            return ResponseUtil.success("Get user success", userDTO);
        } catch (Exception e) {
            return ResponseUtil.error("Lỗi " + e.getMessage(), e.getMessage());
        }
    }


    @PutMapping("/auth/me")
    public  ResponseEntity<ResponseData> post_profile(){
        return null;
    }
    

}
