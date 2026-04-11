package com.dev.backend.service.impl;

import org.springframework.stereotype.Service;


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
    public User getUserById(Integer id) {
        return authRepository.findById(id).orElseThrow(() -> new NotFoundException("USER NOT_FOUND"));
    }

    @Override
    public User getUserByEmail(String email) {
        return authRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("USER NOT_FOUND"));
    }

  

}