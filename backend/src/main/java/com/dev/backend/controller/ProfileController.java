package com.dev.backend.controller;

import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.User;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.util.ResponseUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class ProfileController {

 @GetMapping("/auth/me")
public ResponseEntity<ResponseData> profile(@AuthenticationPrincipal CustomUserDetails userDetails) {
    // 1. Kiểm tra an toàn (nếu cần)
    if (userDetails == null) {
        return ResponseUtil.error("User not authenticated", null);
    }

    User user = userDetails.getUser();
    
    // 2. Phân loại Role và Permission chỉ với 1 lần duyệt (Single Pass)
    Set<String> roles = new HashSet<>();
    Set<String> permissions = new HashSet<>();

    userDetails.getAuthorities().forEach(auth -> {
        String authority = auth.getAuthority();
        if (authority.startsWith("ROLE_")) {
            roles.add(authority.substring(5)); // Thay cho replace để chính xác hơn
        } else {
            permissions.add(authority);
        }
    });

    // 3. Khởi tạo DTO gọn gàng
    UserDTO userDTO = UserDTO.builder() 
            .code(user.getCode())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .image(user.getImage())
            .roles(roles)
            .permissions(permissions)
            .build();

    return ResponseUtil.success("Get user success", userDTO);
}
}
