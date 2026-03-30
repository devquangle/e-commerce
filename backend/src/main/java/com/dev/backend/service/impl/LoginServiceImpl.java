package com.dev.backend.service.impl;

import com.dev.backend.bean.LoginBean;
import com.dev.backend.dto.UserRP;
import com.dev.backend.exception.UnauthorizedException;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.service.AuthService;
import com.dev.backend.service.LoginService;
import com.dev.backend.util.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Map<String, String> login(LoginBean loginBean, HttpServletResponse response) {
        List<UserRP> userRPs = authService.getUserRPByEmail(loginBean.getEmail());

        if (userRPs == null || userRPs.isEmpty()) {
            throw new UnauthorizedException("Tài khoản hoặc mật khẩu không đúng");
        }
        UserRP user = userRPs.getFirst();

        if (!user.enabled()) {
            throw new UnauthorizedException("Tài khoản chưa được kích hoạt");
        }
        if (!user.accountNonLocked()) {
            throw new UnauthorizedException("Tài khoản đã bị khóa");
        }
        if (!passwordEncoder.matches(loginBean.getPassword(), user.password())) {
            throw new UnauthorizedException("Tài khoản hoặc mật khẩu không đúng");
        }

        log.info("User login" + user.email());

        Set<String> roles = userRPs.stream()
                .map(UserRP::roleName)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Set<String> permissions = userRPs.stream()
                .map(UserRP::permissionCode)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        String accessToken = jwtUtil.generateAccessToken(user.id(), new ArrayList<>(roles),
                new ArrayList<>(permissions));
        String refreshToken = jwtUtil.generateRefreshToken(user.id());

        CookieUtil.addCookie(response, "refreshToken", refreshToken);
        Map<String, String> data = Map.of("accessToken", accessToken);

        return data;
    }
}
