package com.dev.backend.repositories;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.backend.entities.Permission;

@Repository
public interface PermissionRepository  extends JpaRepository<Permission, Integer>{

    Optional<Permission>  findByCode(String code);

} 