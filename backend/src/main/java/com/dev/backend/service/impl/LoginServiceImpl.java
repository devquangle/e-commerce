package com.dev.backend.service.impl;

import com.dev.backend.bean.LoginBean;
import com.dev.backend.entity.*;
import com.dev.backend.exception.UnauthorizedException;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.service.LoginService;
import com.dev.backend.service.UserService;
import com.dev.backend.util.CookieUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @Override
    public Map<String, String> login(LoginBean loginBean, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginBean.getEmail(),
                            loginBean.getPassword()));

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            log.info("User login {}", loginBean.getEmail());

            if (!user.isEnabled()) {
                throw new UnauthorizedException("Tài khoản chưa được kích hoạt");
            }

            if (!user.isAccountNonLocked()) {
                throw new UnauthorizedException("Tài khoản đã bị khóa");
            }

            String accessToken = jwtUtil.generateAccessToken(
                    user.getId(),
                    user.getTokenVersion());

            String refreshToken = jwtUtil.generateRefreshToken(
                    user.getId(),
                    user.getTokenVersion());

            CookieUtil.addCookie(response, "refreshToken", refreshToken);

            userService.resetFailedAttempts(user);

            return Map.of("accessToken", accessToken);

        } catch (BadCredentialsException ex) {
            userService.processLoginFail(loginBean.getEmail());
            throw ex;
        }
    }
}
