package com.dev.backend.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.bean.ProfileBean;
import com.dev.backend.constant.JwtType;
import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.User;
import com.dev.backend.exception.DuplicateFieldException;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.UserMapper;
import com.dev.backend.repository.UserRepository;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhone(String phone) {
        return userRepository.existsByPhone(phone);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findUserByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));
    }

    @Override
    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
    }

    @Override
    public User getUserByToken(String token) {
        int userId = jwtUtil.extractUserId(token);
        if ( !jwtUtil.isValid(token, JwtType.ACCESS)) {
            throw new NotFoundException("User not found with token: " + token);
        }
       
        return getUserById(userId);

    }

    @Override
    public boolean isEmpty() {
        return userRepository.count() == 0;
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Object userDTO(String token) {
        return null;
    }

    @Override
    public boolean existsByCode(String code) {
        return userRepository.existsByCode(code);
    }

    @Override
    public void processLoginFail(String email) {
        User user = getUserByEmail(email);
        int failedAttempt = user.getFailedAttempt();
        user.setFailedAttempt(failedAttempt + 1);
        if (failedAttempt >= 5) {
            user.setAccountNonLocked(false);
            user.setLockTime(LocalDateTime.now());
        }
        saveUser(user);
    }

    @Override
    public void resetFailedAttempts(String email) {
        User user = getUserByEmail(email);
        user.setFailedAttempt(0);
        user.setLockTime(null);
        user.setAccountNonLocked(true);
        saveUser(user);
    }

    @Override
    public UserDTO updateProfile(Integer userId, ProfileBean profileBean, MultipartFile image) {

        User user = getUserById(userId);

        validated(profileBean, user);

        user.setFullName(profileBean.getFullName());
        user.setEmail(profileBean.getEmail());
        user.setPhone(profileBean.getPhone());
        user.setStreet(profileBean.getStreet());
        if (image != null) {
            user.setImage(image.getOriginalFilename());
        }
        saveUser(user);

        return dto(null);
    }

    @Override
    public void validated(ProfileBean profileBean, User user) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());
        if (!profileBean.getEmail().equals(user.getEmail())
                && existsByEmail(profileBean.getEmail())) {
            errors.addError("email", "Email đã được sử dụng");
        }
        if (!profileBean.getPhone().equals(user.getPhone()) && existsByPhone(profileBean.getPhone())) {
            errors.addError("phone", "Số điện thoại đã được sử dụng");
        }

        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
    }

    @Override
    public UserDTO dto(CustomUserDetails userDetails) {
        return userMapper.toDTO(userDetails);
    }

}