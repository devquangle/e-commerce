package com.dev.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.entity.Role;


public interface RoleRepository extends JpaRepository<Role, Integer> {
       @Query("SELECT r FROM Role r WHERE r.code = :code")
       Optional<Role> findByCode(@Param("code") String code);
}
