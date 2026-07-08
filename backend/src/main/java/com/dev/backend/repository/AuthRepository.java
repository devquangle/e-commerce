package com.dev.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.entity.User;

public interface AuthRepository extends JpaRepository<User, Integer> {

    

    @Query("SELECT DISTINCT u FROM User u WHERE u.email = :email")
    @EntityGraph(attributePaths = {
            "roles"
    })
    Optional<User> findByEmail(@Param("email") String email);

    @Query("SELECT DISTINCT u FROM User u WHERE u.id = :id")
    @EntityGraph(attributePaths = {
            "roles"
    })
    Optional<User> findById(@Param("id")Integer id);

}
