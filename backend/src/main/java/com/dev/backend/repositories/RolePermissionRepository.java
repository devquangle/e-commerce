package com.dev.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.backend.entities.RolePermission;
import com.dev.backend.entities.Permission;
import com.dev.backend.entities.Role;

@Repository
public interface RolePermissionRepository  extends JpaRepository<RolePermission, Integer> {
    boolean existsByRoleAndPermission(Role role, Permission permission);
}
