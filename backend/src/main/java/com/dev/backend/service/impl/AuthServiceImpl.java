package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.dto.UserRP;
import com.dev.backend.repository.AuthRepository;
import com.dev.backend.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthRepository authRepository;

    @Override
    public List<UserRP> getUserRPById(Integer id) {
        List<UserRP> userRPs = authRepository.findUserRPById(id);
        if (userRPs == null || userRPs.isEmpty()) {
            throw new IllegalArgumentException("Tài khoản hoặc mật khẩu không đúng");
        }
        return userRPs;
    }

    @Override
    public List<UserRP> getUserRPByEmail(String email) {
        List<UserRP> userRPs = authRepository.findUserRPByEmail(email);
        if (userRPs == null || userRPs.isEmpty()) {
            throw new IllegalArgumentException("Tài khoản hoặc mật khẩu không đúng");
        }
        return userRPs;
    }

}