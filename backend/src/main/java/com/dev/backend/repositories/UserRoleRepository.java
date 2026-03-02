package com.dev.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.backend.entities.UserRole;
@Repository
public interface UserRoleRepository  extends JpaRepository<UserRole,Integer>{

}
