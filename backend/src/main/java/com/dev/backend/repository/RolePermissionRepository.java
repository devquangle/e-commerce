package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.backend.entity.Permission;
import com.dev.backend.entity.Role;
import com.dev.backend.entity.RolePermission;

@Repository
public interface RolePermissionRepository  extends JpaRepository<RolePermission, Integer> {
    boolean existsByRoleAndPermission(Role role, Permission permission);
}
