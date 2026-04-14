package com.dev.backend.service.impl;

import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.dev.backend.bean.LoginBean;
import com.dev.backend.constant.JwtType;
import com.dev.backend.entity.User;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.exception.UnauthorizedException;
import com.dev.backend.repository.AuthRepository;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.service.AuthService;
import com.dev.backend.service.UserService;
import com.dev.backend.util.CookieUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @Override
    public User getUserById(Integer id) {
        return authRepository.findById(id).orElseThrow(() -> new NotFoundException("USER NOT_FOUND"));
    }

    @Override
    public User getUserByEmail(String email) {
        return authRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("USER NOT_FOUND"));
    }

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

    @Override
    public Map<String, String> refreshToken(HttpServletRequest request) {
        String refreshToken = CookieUtil.getCookie(request, "refreshToken");
        if (!jwtUtil.isValid(refreshToken, JwtType.REFRESH)) {
            throw new UnauthorizedException("Token không hợp lệ");
        }
        int userId = jwtUtil.extractUserId(refreshToken);
        User user = getUserById(userId);
        if (!jwtUtil.isTokenVersionValid(refreshToken, user.getTokenVersion())) {
            throw new UnauthorizedException("Token đã bị thu hồi");
        }

        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getTokenVersion());
        return Map.of("accessToken", accessToken);
    }

    @Override
    public void logout(String refreshToken, HttpServletResponse response) {
        CookieUtil.deleteCookie(response, refreshToken);
    }

}