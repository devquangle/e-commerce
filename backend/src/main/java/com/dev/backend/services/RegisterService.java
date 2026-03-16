package com.dev.backend.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.backend.beans.RegisterBean;
import com.dev.backend.entities.User;
import com.dev.backend.entities.UserRole;
import com.dev.backend.utils.GenerateCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegisterService {

    private final UserService userService;
    private final UserRoleService userRoleService;
    private final RoleService roleService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(RegisterBean registerBean) {
        User re = new User();

        if (userService.existsByEmail(registerBean.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }
        if (!registerBean.getPassword().equals(registerBean.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu không khớp");
        }
        String generatedCode = GenerateCode.generateCode(10);
        if (userService.existsByCode(generatedCode)) {
            throw new IllegalArgumentException("Code đã được sử dụng");
        }
        re.setEmail(registerBean.getEmail());
        re.setFullName(registerBean.getFullName());
        re.setPassword(passwordEncoder.encode(registerBean.getPassword()));
        re.setCode(generatedCode);
        User saved = userService.save(re);

        UserRole userRole = new UserRole();
        userRole.setUser(saved);
        userRole.setRole(roleService.getRoleUser());
        userRoleService.save(userRole);

        return saved;
    }

}
