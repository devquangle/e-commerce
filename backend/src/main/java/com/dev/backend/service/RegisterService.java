package com.dev.backend.service;

import java.util.Map;

import com.dev.backend.bean.RegisterBean;

public interface RegisterService {

    Map<String, String> register(RegisterBean registerBean, String role);

    void setUp();

}
