package com.dev.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.entity.UserRole;
import com.dev.backend.repository.UserRoleRepository;

@Service
public class UserRoleService {
    @Autowired
    private UserRoleRepository userRoleRepository;

    public UserRole save(UserRole userRole) {
        return userRoleRepository.save(userRole);
    }
}
