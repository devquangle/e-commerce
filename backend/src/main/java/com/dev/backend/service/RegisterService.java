package com.dev.backend.service;

import com.dev.backend.bean.RegisterBean;
import com.dev.backend.entity.User;

public interface RegisterService {

    User register(RegisterBean registerBean, String role);

    void verifyRegister(String token);

    
    void handleTokenForResend(String token);

    void setUp();

}
