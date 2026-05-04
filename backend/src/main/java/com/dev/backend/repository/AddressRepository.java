package com.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dev.backend.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Integer>{
    
    Optional<Address> findByUserIdAndIsDefaultIsTrue(Integer userId);

    @Query("SELECT a FROM Address a WHERE a.id = :id AND a.user.id = :userId")
    Optional<Address> findByIdAndUserId(Integer id, Integer userId);
    int countByUserId(Integer userId);
    List<Address> findByUserId(Integer userId);
}
