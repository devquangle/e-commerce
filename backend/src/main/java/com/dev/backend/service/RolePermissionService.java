package com.dev.backend.service;

import java.util.Collections;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.dev.backend.entity.Permission;
import com.dev.backend.entity.Role;
import com.dev.backend.entity.RolePermission;
import com.dev.backend.repository.RolePermissionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RolePermissionService {
    private final RolePermissionRepository rolePermissionRepository;

    @Transactional
    public void addPermission(Role role, Permission permission) {
        boolean exists = rolePermissionRepository.existsByRoleAndPermission(role, permission);
        if (!exists) {
            RolePermission rp = new RolePermission();
            rp.setRole(role);
            rp.setPermission(permission);
            rolePermissionRepository.save(rp);
        }
    }

    public boolean isEmpty() {
        return rolePermissionRepository.count() == 0;
    }

    public Set<String> findPermissionCodes(Set<Role> roles) {
        if (roles == null || roles.isEmpty()) {
            return Collections.emptySet();
        }

        return rolePermissionRepository.findPermissionCodes(roles);
    }

}
