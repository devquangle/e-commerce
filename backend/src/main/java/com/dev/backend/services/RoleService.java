package com.dev.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.entities.Role;
import com.dev.backend.repositories.RoleRepository;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Role save(Role role) {
        return roleRepository.save(role);
    }

    public Role findById(Integer id){
        return roleRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("Không tìm thấy role "+ id));
    }

    public Role getRoleUser(){
        return findById(1);
    }
}
