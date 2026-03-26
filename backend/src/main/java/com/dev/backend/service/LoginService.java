package com.dev.backend.service;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

import com.dev.backend.bean.LoginBean;

public interface LoginService {

    Map<String, String> login(LoginBean loginBean, HttpServletResponse response);
}
