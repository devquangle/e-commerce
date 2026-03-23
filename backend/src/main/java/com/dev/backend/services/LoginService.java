package com.dev.backend.services;

import com.dev.backend.beans.LoginBean;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

public interface LoginService {

    Map<String, String> login(LoginBean loginBean, HttpServletResponse response);
}
