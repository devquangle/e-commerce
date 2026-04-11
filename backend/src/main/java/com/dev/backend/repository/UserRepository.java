package com.dev.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

   
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findUserByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u)>0 FROM User u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u)>0 FROM User u WHERE u.phone = :phone")
    boolean existsByPhone(@Param("phone") String phone);

    @Query("SELECT COUNT(u)>0 FROM User u WHERE u.code = :code")
    boolean existsByCode(@Param("code") String code);





    

}