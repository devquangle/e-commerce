package com.dev.backend.service.impl;

import com.dev.backend.bean.LoginBean;
import com.dev.backend.entity.User;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.service.LoginService;
import com.dev.backend.service.UserService;
import com.dev.backend.util.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Map<String, String> login(LoginBean loginBean, HttpServletResponse response) {
        User user = userService.getUserByEmail(loginBean.getEmail());
        if (user == null || !passwordEncoder.matches(loginBean.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Tài khoản hoặc mật khẩu không đúng");
        }

  
        List<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getName())
                .distinct()
                .toList();

        List<String> permissions = user.getUserRoles().stream()
                .flatMap(ur -> ur.getRole().getRolePermissions().stream())
                .map(rp -> rp.getPermission().getCode())
                .distinct()
                .toList();

       
        String accessToken = jwtUtil.generateAccessToken(user.getId(), roles, permissions);
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        CookieUtil.addCookie(response, "refreshToken", refreshToken);
        Map<String, String> data = Map.of("accessToken", accessToken);



        return data;
    }
}
