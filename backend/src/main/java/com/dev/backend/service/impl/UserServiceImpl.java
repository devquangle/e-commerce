package com.dev.backend.service.impl;

import org.springframework.stereotype.Service;

import com.dev.backend.entity.User;
import com.dev.backend.repository.UserRepository;
import com.dev.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

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
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }

    @Override
    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
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

}