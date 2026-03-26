package com.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.backend.entity.User;
import com.dev.backend.dto.UserAuthorityProjection;
import com.dev.backend.dto.UserWithAuthorityProjection;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @EntityGraph(attributePaths = {
            "userRoles", // 1. Join từ User sang UserRole
            "userRoles.role", // 2. Join từ UserRole sang Role
            "userRoles.role.rolePermissions", // 3. Join từ Role sang RolePermission
            "userRoles.role.rolePermissions.permission" // 4. Join từ RolePermission sang Permission
    })
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findBasicByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u)>0 FROM User u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u)>0 FROM User u WHERE u.phone = :phone")
    boolean existsByPhone(@Param("phone") String phone);

    @Query("SELECT COUNT(u)>0 FROM User u WHERE u.code = :code")
    boolean existsByCode(@Param("code") String code);

    @Query("""
                SELECT u
                FROM User u
                LEFT JOIN FETCH u.userRoles ur
                LEFT JOIN FETCH ur.role r
                LEFT JOIN FETCH r.rolePermissions rp
                LEFT JOIN FETCH rp.permission p
                WHERE u.id = :id
            """)
    Optional<User> getUserDTO(@Param("id") Integer id);

    // @Query("""
    // SELECT new com.dev.backend.dtos.UserDTO(
    // u.fullName, u.email, u.phone, u.street, u.code, u.image,
    // ur.role.name,
    // rp.permission.code
    // )
    // FROM User u
    // LEFT JOIN u.userRoles ur
    // LEFT JOIN ur.role r
    // LEFT JOIN r.rolePermissions rp
    // WHERE u.id = :id
    // """)
    // List<UserDTO> findUserDTOById(@Param("id") Integer id);

    @EntityGraph(attributePaths = {
            "userRoles", // 1. Join từ User sang UserRole
            "userRoles.role", // 2. Join từ UserRole sang Role
            "userRoles.role.rolePermissions", // 3. Join từ Role sang RolePermission
            "userRoles.role.rolePermissions.permission" // 4. Join từ RolePermission sang Permission
    })
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findUserDetailById(@Param("id") Integer id);

    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findBasicById(@Param("id") Integer id);

    @Query("""
            SELECT r.name AS roleName, p.code AS permissionCode
            FROM User u
            LEFT JOIN u.userRoles ur
            LEFT JOIN ur.role r
            LEFT JOIN r.rolePermissions rp
            LEFT JOIN rp.permission p
            WHERE u.id = :id
            """)
    List<UserAuthorityProjection> findAuthorityProjectionByUserId(@Param("id") Integer id);

    @Query("""
            SELECT r.name AS roleName, p.code AS permissionCode
            FROM User u
            LEFT JOIN u.userRoles ur
            LEFT JOIN ur.role r
            LEFT JOIN r.rolePermissions rp
            LEFT JOIN rp.permission p
            WHERE u.email = :email
            """)
    List<UserAuthorityProjection> findAuthorityProjectionByEmail(@Param("email") String email);

    @Query("""
            SELECT u.id AS userId,
                   u.fullName AS fullName,
                   u.email AS email,
                   u.code AS code,
                   u.image AS image,
                   r.name AS roleName,
                   p.code AS permissionCode
            FROM User u
            LEFT JOIN u.userRoles ur
            LEFT JOIN ur.role r
            LEFT JOIN r.rolePermissions rp
            LEFT JOIN rp.permission p
            WHERE u.id = :id
            """)
    List<UserWithAuthorityProjection> findUserWithAuthoritiesProjectionById(@Param("id") Integer id);

}