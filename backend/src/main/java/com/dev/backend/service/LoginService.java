package com.dev.backend.service;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

import com.dev.backend.dto.auth.LoginRequest;

public interface LoginService {

    Map<String, String> login(LoginRequest request, HttpServletResponse response);
}
