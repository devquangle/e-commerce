package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.dto.UserRP;
import com.dev.backend.entity.User;
import com.dev.backend.exception.NotFoundException;
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
        return userRPs;
    }

    @Override
    public List<UserRP> getUserRPByEmail(String email) {
        List<UserRP> userRPs = authRepository.findUserRPByEmail(email);
        return userRPs;
    }

    @Override
    public User getUserById(Integer id) {
        return authRepository.findById(id).orElseThrow(()-> new NotFoundException("User NOTFOUND"));
    }

    @Override
    public User getUserByEmail(String email) {
        return authRepository.findByEmail(email).orElseThrow(()-> new NotFoundException("User NOTFOUND"));
    }

}