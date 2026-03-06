package com.dev.backend.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.backend.beans.LoginBean;
import com.dev.backend.entities.Role;
import com.dev.backend.entities.User;
import com.dev.backend.security.jwt.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserService userService;

    private final JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String login(LoginBean loginBean) {

        User user = userService.findUserByEmail(loginBean.getEmail());

        if (user == null || !passwordEncoder.matches(loginBean.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Tài khoản hoặc mật khẩu không đúng");
        }
       List<String> roles = user.getUserRoles() .stream() .map(ur -> ur.getRole().getName()) .toList();
        System.out.println(roles + "rlologinnpass" +roles);

        return jwtUtil.generateToken(
                user.getId(),
                roles,
                "LOGIN");
    }

}
