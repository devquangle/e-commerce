package com.dev.backend.services;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.backend.beans.LoginBean;

import com.dev.backend.entities.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserService userService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User login(LoginBean loginBean) {

        User user = userService.findUserByEmail(loginBean.getEmail());

        if (user == null || !passwordEncoder.matches(loginBean.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Tài khoản hoặc mật khẩu không đúng");
        }
     

        return user;
    }

}
