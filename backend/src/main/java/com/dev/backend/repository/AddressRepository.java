package com.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Integer>{
    
    Optional<Address> findByUserIdAndIsDefaultIsTrue(Integer userId);
    int countByUserId(Integer userId);
    List<Address> findByUserId(Integer userId);
}
