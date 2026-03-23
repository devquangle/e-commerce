package com.dev.backend.services.impl;

import com.dev.backend.beans.LoginBean;
import com.dev.backend.entities.User;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.services.LoginService;
import com.dev.backend.services.UserService;
import com.dev.backend.utils.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LoginImpl implements LoginService {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Map<String, String> login(LoginBean loginBean, HttpServletResponse response) {
        User user = userService.getUserByEmail(loginBean.getEmail());
        if (user == null || !passwordEncoder.matches(loginBean.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Tài khoản hoặc mật khẩu không đúng");
        }

        // 2. Lấy roles & permissions
        List<String> roles = user.getUserRoles().stream()
                .map(ur -> ur.getRole().getName())
                .distinct()
                .toList();

        List<String> permissions = user.getUserRoles().stream()
                .flatMap(ur -> ur.getRole().getRolePermissions().stream())
                .map(rp -> rp.getPermission().getCode())
                .distinct()
                .toList();

        // 3. Tạo JWT
        String accessToken = jwtUtil.generateAccessToken(user.getId(), roles, permissions);
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        // 4. Thêm refreshToken vào cookie
        CookieUtil.addCookie(response, "refreshToken", refreshToken);
        Map<String, String> data = Map.of("accessToken", accessToken);



        return data;
    }
}
