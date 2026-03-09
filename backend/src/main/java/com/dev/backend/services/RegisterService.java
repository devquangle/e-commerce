package com.dev.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.backend.beans.RegisterBean;
import com.dev.backend.entities.User;
import com.dev.backend.entities.UserRole;

@Service
public class RegisterService {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRoleService userRoleService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(RegisterBean registerBean) {
        User re = new User();

        if (userService.existsByEmail(registerBean.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }
        if (!registerBean.getPassword().equals(registerBean.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu không khớp");
        }
        re.setEmail(registerBean.getEmail());
        re.setFullName(registerBean.getFullName());
        re.setPassword(passwordEncoder.encode(registerBean.getPassword()));
        User saved = userService.save(re);

        UserRole userRole = new UserRole();
        userRole.setUser(saved);
        userRole.setRole(roleService.getRoleUser());
        userRoleService.save(userRole);

        return saved;
    }


   
}
