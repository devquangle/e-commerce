package com.dev.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @EntityGraph(attributePaths = {
            "userRoles", // fetch User.userRoles
            "userRoles.role", // fetch Role cho mỗi UserRole
            "userRoles.role.rolePermissions", // fetch RolePermission cho mỗi Role
            "userRoles.role.rolePermissions.permission" // fetch Permission cho mỗi RolePermission
    })
    Optional<User> findByEmail(String email);

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

}