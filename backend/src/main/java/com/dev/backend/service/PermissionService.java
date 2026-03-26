package com.dev.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.entity.Permission;
import com.dev.backend.repository.PermissionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermissionService {
    
    private final PermissionRepository permissionRepository;

    public Permission save(Permission permission){
        return permissionRepository.save(permission);
    }
    public boolean isEmpty(){
        return permissionRepository.count() == 0;
    }
    public List<Permission> findAll() {
        return permissionRepository.findAll();
    }
    public Permission findByCode(String code) {
        return permissionRepository.findByCode(code).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy permission " + code));
    }

}
