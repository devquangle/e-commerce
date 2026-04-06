package com.dev.backend.service.impl;

import com.dev.backend.bean.LoginBean;
import com.dev.backend.entity.Role;
import com.dev.backend.entity.User;
import com.dev.backend.exception.UnauthorizedException;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.service.AuthService;
import com.dev.backend.service.LoginService;
import com.dev.backend.service.RolePermissionService;
import com.dev.backend.util.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;

import java.util.Map;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {
    private final AuthService authService;
    private final RolePermissionService rolePermissionService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Map<String, String> login(LoginBean loginBean, HttpServletResponse response) {
     
        User user = authService.getUserByEmail(loginBean.getEmail());

        if (!user.isEnabled()) {
            throw new UnauthorizedException("Tài khoản chưa được kích hoạt");
        }
        if (!user.isAccountNonLocked()) {
            throw new UnauthorizedException("Tài khoản đã bị khóa");
        }
        if (!passwordEncoder.matches(loginBean.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Tài khoản hoặc mật khẩu không đúng");
        }

        log.info("User login" + user.getEmail());

        Set<String> roles = new HashSet<>();
        Set<Role> roleEntities = new HashSet<>();

        user.getUserRoles().forEach(ur -> {
            Role role = ur.getRole();
            if (role != null) {
                roles.add(role.getName());
                roleEntities.add(role);
            }
        });

        Set<String> permissions = rolePermissionService.findPermissionCodes(roleEntities);

        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getTokenVersion(),
                new ArrayList<>(roles),
                new ArrayList<>(permissions));
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getTokenVersion());

        CookieUtil.addCookie(response, "refreshToken", refreshToken);
        Map<String, String> data = Map.of("accessToken", accessToken);

        return data;
    }
}
