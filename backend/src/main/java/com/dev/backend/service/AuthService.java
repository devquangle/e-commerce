package com.dev.backend.service;
import com.dev.backend.dto.auth.LoginRequest;
import com.dev.backend.dto.auth.LoginResponse;
import com.dev.backend.dto.auth.RefreshResponse;
import com.dev.backend.entity.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    User getUserById(Integer id);

    User getUserByEmail(String email);

    LoginResponse login(LoginRequest loginRequest, HttpServletResponse response);

    RefreshResponse refreshToken(HttpServletRequest request);

    void logout(HttpServletResponse response);

}