package com.dev.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.dev.backend.entity.User;

@Repository
public interface AuthRepository extends JpaRepository<User, Integer> {

    

    @Query("SELECT DISTINCT u FROM User u WHERE u.email = :email")
    @EntityGraph(attributePaths = {
            "userRoles",
            "userRoles.role",
            "userRoles.role.rolePermissions",
            "userRoles.role.rolePermissions.permission"
    })
    Optional<User> findByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u WHERE u.id = :id")
    @EntityGraph(attributePaths = {
            "userRoles",
            "userRoles.role",
            "userRoles.role.rolePermissions",
            "userRoles.role.rolePermissions.permission"
    })
    Optional<User> findById(Integer id);

}
