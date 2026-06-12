package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.dev.backend.entity.UserRole;


public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {

}
