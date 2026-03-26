package com.dev.backend.service.impl;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dev.backend.bean.RegisterBean;
import com.dev.backend.entity.User;
import com.dev.backend.entity.UserRole;
import com.dev.backend.constant.RoleName;
import com.dev.backend.service.RegisterService;
import com.dev.backend.service.RoleService;
import com.dev.backend.service.UserRoleService;
import com.dev.backend.service.UserService;
import com.dev.backend.util.GenerateCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegisterServiceImpl implements RegisterService {
    private final UserService userService;
    private final UserRoleService userRoleService;
    private final RoleService roleService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public User register(RegisterBean registerBean, String role) {
        User re = new User();

        if (userService.existsByEmail(registerBean.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }
        if (!registerBean.getPassword().equals(registerBean.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu không khớp");
        }
        String generatedCode;
        do {
            generatedCode = GenerateCode.generateCode(10);
        } while (userService.existsByCode(generatedCode));
        re.setCode(generatedCode);
        re.setEmail(registerBean.getEmail());
        re.setFullName(registerBean.getFullName());
        re.setPassword(passwordEncoder.encode(registerBean.getPassword()));
        re.setCode(generatedCode);
        User saved = userService.saveUser(re);
        UserRole userRole = new UserRole();
        userRole.setUser(saved);
        userRole.setRole(roleService.findByName(RoleName.CUSTOMER.name()));
        userRoleService.save(userRole);

        return saved;
    }

    @Override
    public void setUp() {
        RegisterBean customer = new RegisterBean("customer", "customer@gmail.com", "123456", "123456");
        RegisterBean super_admin = new RegisterBean("super_admin", "superadmin@gmail.com", "123456", "123456");
        register(customer, RoleName.CUSTOMER.name());
        register(super_admin, RoleName.SUPER_ADMIN.name());

    }
}
