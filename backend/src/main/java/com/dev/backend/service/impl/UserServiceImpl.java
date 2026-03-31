package com.dev.backend.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.dev.backend.constant.JwtType;
import com.dev.backend.entity.User;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.repository.UserRepository;
import com.dev.backend.security.jwt.JwtUtil;
import com.dev.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
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
        return userRepository.findBasicByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }

    @Override
    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
    }

    @Override
    public User getUserByToken(String token) {
        String userId = jwtUtil.extractUserId(token);
        if (userId == null || !jwtUtil.isValid(token, JwtType.ACCESS)) {
            throw new NotFoundException("User not found with token: " + token);
        }
        Integer id;
        try {
            id = Integer.parseInt(userId);
        } catch (NumberFormatException e) {
            throw new NotFoundException("Invalid user ID in token: " + token);
        }
        return getUserById(id);

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
    public void processLoginFail(Integer id) {
        User user = getUserById(id);
        int failedAttempt = user.getFailedAttempt();
        user.setFailedAttempt(failedAttempt + 1);
        if (failedAttempt >= 5) {
            user.setAccountNonLocked(false);
            user.setLockTime(LocalDateTime.now());
        }
        saveUser(user);

    }

    @Override
    public void resetFailedAttempts(Integer id) {
        User user = getUserById(id);
        user.setFailedAttempt(0);
        user.setLockTime(null);
        user.setAccountNonLocked(true);
        saveUser(user);
    }

}