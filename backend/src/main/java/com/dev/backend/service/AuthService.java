package com.dev.backend.service;

import java.util.Map;

import com.dev.backend.bean.LoginBean;
import com.dev.backend.entity.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    User getUserById(Integer id);

    User getUserByEmail(String email);

    Map<String, String> login(LoginBean loginBean, HttpServletResponse response);

    Map<String, String> refreshToken(HttpServletRequest request);

    void logout(String refreshToken, HttpServletResponse response);

}