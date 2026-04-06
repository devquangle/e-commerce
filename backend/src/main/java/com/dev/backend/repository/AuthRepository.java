package com.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.backend.dto.UserRP;

import com.dev.backend.entity.User;

@Repository
public interface AuthRepository extends JpaRepository<User, Integer> {

    @Query("""
            SELECT
                u.id AS id,
                u.tokenVersion AS tokenVersion,
                u.fullName AS fullName,
                u.email AS email,
                u.password AS password,
                u.phone AS phone,
                u.code AS code,
                u.street AS street,
                u.image AS image,
                u.createAt AS createAt,
                u.updateAt AS updateAt,
                u.enabled AS enabled,
                u.accountNonLocked AS accountNonLocked,
                u.failedAttempt AS failedAttempt,
                u.lockTime AS lockTime,
                r.name AS roleName,
                p.code AS permissionCode
            FROM User u
            LEFT JOIN u.userRoles ur
            LEFT JOIN ur.role r
            LEFT JOIN r.rolePermissions rp
            LEFT JOIN rp.permission p
            WHERE u.email = :email
            """)
    List<UserRP> findUserRPByEmail(@Param("email") String email);

    @Query("""
            SELECT
                u.id AS id,
                u.tokenVersion AS tokenVersion,
                u.fullName AS fullName,
                u.email AS email,
                u.password AS password,
                u.phone AS phone,
                u.code AS code,
                u.street AS street,
                u.image AS image,
                u.createAt AS createAt,
                u.updateAt AS updateAt,
                u.enabled AS enabled,
                u.accountNonLocked AS accountNonLocked,
                u.failedAttempt AS failedAttempt,
                u.lockTime AS lockTime,
                r.name AS roleName,
                p.code AS permissionCode
            FROM User u
            LEFT JOIN u.userRoles ur
            LEFT JOIN ur.role r
            LEFT JOIN r.rolePermissions rp
            LEFT JOIN rp.permission p
            WHERE u.id = :id
            """)
    List<UserRP> findUserRPById(@Param("id") Integer id);

    @EntityGraph(attributePaths = {
            "userRoles", // 1. Join từ User sang UserRole
            "userRoles.role", // 2. Join từ UserRole sang Role
    })
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = {
            "userRoles", // 1. Join từ User sang UserRole
            "userRoles.role", // 2. Join từ UserRole sang Role
    })
    Optional<User> findById(Integer id);

}
