package com.dev.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.backend.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

 

    Optional<User> findByEmail(String email);

    @Query("SELECT COUNT(u)>0 FROM User u WHERE u.email = :email")
    boolean checkEmail(@Param("email") String email);

}