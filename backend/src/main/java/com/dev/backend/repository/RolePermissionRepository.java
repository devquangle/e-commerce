package com.dev.backend.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dev.backend.entity.Permission;
import com.dev.backend.entity.Role;
import com.dev.backend.entity.RolePermission;

@Repository
public interface RolePermissionRepository  extends JpaRepository<RolePermission, Integer> {
    boolean existsByRoleAndPermission(Role role, Permission permission);
    
    @Query("""
            SELECT rp.permission.code
            FROM RolePermission rp
            WHERE rp.role IN :roles
            """)
    Set<String> findPermissionCodes(Set<Role> roles);
}
