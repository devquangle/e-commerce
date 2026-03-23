package com.dev.backend.services;

import com.dev.backend.beans.RegisterBean;
import com.dev.backend.entities.User;

public interface RegisterService {

    User register(RegisterBean registerBean, String role);

    void setUp();

}
