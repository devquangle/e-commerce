package com.dev.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.entities.Role;
import com.dev.backend.repositories.RoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {
    
    private final RoleRepository roleRepository;

    public boolean isEmpty() {
        return roleRepository.count() == 0;
    }
    public List<Role> findAll() {
        return roleRepository.findAll();
    }
    public Role save(Role role) {
        return roleRepository.save(role);
    }

    public Role findById(Integer id){
        return roleRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("Không tìm thấy role "+ id));
    }

    public Role findByName(String name){
        return roleRepository.findByName(name).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy role " + name));
    }
}
