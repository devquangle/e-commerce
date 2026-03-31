package com.dev.backend.service;


import com.dev.backend.bean.RegisterBean;
import com.dev.backend.entity.User;

public interface RegisterService {

    User register(RegisterBean registerBean, String role);

    boolean verifyRegister(String token);

    void setUp();

}
