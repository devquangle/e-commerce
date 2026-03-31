package com.dev.backend.service.impl;

import java.util.HashMap;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.dev.backend.bean.RegisterBean;
import com.dev.backend.entity.User;
import com.dev.backend.entity.UserRole;
import com.dev.backend.exception.DuplicateFieldException;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.constant.JwtType;
import com.dev.backend.constant.RoleName;
import com.dev.backend.service.RegisterService;
import com.dev.backend.service.RoleService;
import com.dev.backend.service.UserService;
import com.dev.backend.util.GenerateCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegisterServiceImpl implements RegisterService {
    private final UserService userService;
    private final RoleService roleService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    @Override
    public User register(RegisterBean registerBean, String role) {
        User re = new User();

        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
        if (userService.existsByEmail(registerBean.getEmail())) {
           errors.addError("email", "Email đã được sử dụng");
        }
        if (!registerBean.getPassword().equals(registerBean.getConfirmPassword())) {
            errors.addError("confirmPassword", "Mật khẩu không khớp nhau");
        }

        if (!errors.getErrors().isEmpty()) {
            throw errors;
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

        re.getUserRoles().add(new UserRole(null, re, roleService.findByName(role)));

        User saved = userService.saveUser(re);
        
 
        return saved;
    }
    @Override
    public boolean verifyRegister(String token) {
        if (!jwtUtil.isValid(token, JwtType.VERIFY_EMAIL)) {
            return false;
        }
        String userId = jwtUtil.extractUserId(token);
        Integer id = Integer.parseInt(userId);
        User user = userService.getUserById(id);
        user.setEnabled(true);
        userService.saveUser(user);
        return true;
    }

    @Override
    public void setUp() {
        RegisterBean customer = new RegisterBean("customer", "customer@gmail.com", "123456", "123456");
        RegisterBean super_admin = new RegisterBean("super_admin", "superadmin@gmail.com", "123456", "123456");
        register(customer, RoleName.CUSTOMER.name());
        register(super_admin, RoleName.SUPER_ADMIN.name());

    }
}
