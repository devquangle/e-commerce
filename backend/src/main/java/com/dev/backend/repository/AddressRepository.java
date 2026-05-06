package com.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Integer> {

    Optional<Address> findByUserIdAndIsDefaultIsTrue(Integer userId);

    @Query("SELECT a FROM Address a WHERE a.id = :id AND a.user.id = :userId")
    Optional<Address> findByIdAndUserId(Integer id, Integer userId);

    int countByUserId(Integer userId);

    @Query("SELECT a FROM Address a WHERE a.user.id = :userId ORDER BY a.id DESC ")
    List<Address> findByUserId(Integer userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
                UPDATE Address a
                SET a.isDefault = false
                WHERE a.user.id = :userId
                AND a.isDefault = true
            """)
    void clearDefaultOnly(@Param("userId") Integer userId);
}
