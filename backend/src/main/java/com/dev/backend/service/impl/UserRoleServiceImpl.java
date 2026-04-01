package com.dev.backend.service.impl;

import org.springframework.stereotype.Service;

import com.dev.backend.entity.UserRole;
import com.dev.backend.repository.UserRoleRepository;
import com.dev.backend.service.UserRoleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserRoleServiceImpl implements UserRoleService {

    private final UserRoleRepository userRoleRepository;

    @Override
    public boolean isEmpty() {
        // TODO Auto-generated method stub
        return userRoleRepository.count() == 0;
    }

    @Override
    public UserRole save(UserRole userRole) {
       
        return userRoleRepository.save(userRole);
    }

}
