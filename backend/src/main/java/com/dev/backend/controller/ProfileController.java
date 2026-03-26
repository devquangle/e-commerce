package com.dev.backend.controller;

import com.dev.backend.dto.UserDTO;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.util.ResponseUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    @GetMapping("/auth/me")
    public ResponseEntity<ResponseData> profile(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Set<String> authorities = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());

            Set<String> roles = authorities.stream()
                    .filter(a -> a.startsWith("ROLE_"))
                    .map(a -> a.replace("ROLE_", ""))
                    .collect(Collectors.toSet());

            Set<String> permissions = authorities.stream()
                    .filter(a -> !a.startsWith("ROLE_"))
                    .collect(Collectors.toSet());

            UserDTO userDTO = new UserDTO();
            userDTO.setFullName(userDetails.getFullName());
            userDTO.setEmail(userDetails.getEmail());
            userDTO.setPhone(userDetails.getPhone());
            userDTO.setStreet(userDetails.getStreet());
            userDTO.setImage(userDetails.getImage());
            userDTO.setRoles(roles);
            userDTO.setPermissions(permissions);

            return ResponseUtil.success("get user success", userDTO);
        } catch (Exception e) {
            return ResponseUtil.error("profile error: " + e.getMessage(), null);
        }
    }
}
