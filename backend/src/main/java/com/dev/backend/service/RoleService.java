package com.dev.backend.service;

import java.util.List;


import com.dev.backend.entity.Role;


public interface RoleService {
    
   boolean isEmpty();
   List<Role> findAll();
   Role save(Role role);
   Role findById(Integer id);
   Role findByName(String name);
}
