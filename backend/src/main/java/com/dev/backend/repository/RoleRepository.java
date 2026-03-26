package com.dev.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dev.backend.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
       @Query("SELECT r FROM Role r WHERE r.name = :name")
       Optional<Role> findByName(String name);
}
