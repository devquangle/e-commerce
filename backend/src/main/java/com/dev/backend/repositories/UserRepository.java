package com.dev.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dev.backend.dtos.UserDTO;
import com.dev.backend.entities.User;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    @Query("SELECT COUNT(u)>0 FROM User u WHERE u.email = :email")
    boolean checkEmail(@Param("email") String email);

    @Query("SELECT COUNT(u)>0 FROM User u WHERE u.code = :code")
    boolean existsByCode(@Param("code") String code);

    @Query("""
    SELECT u
    FROM User u
    LEFT JOIN FETCH u.userRoles ur
    LEFT JOIN FETCH ur.role r
    LEFT JOIN FETCH r.rolePermissions rp
    LEFT JOIN FETCH rp.permission p
    WHERE u.id = :id
""")
    Optional<User> getUserDTO(@Param("id") Integer id);



    @Query("""
    SELECT new com.dev.backend.dtos.UserDTO(
        u.fullName, u.email, u.phone, u.street, u.code, u.image,
        ur.role.name,
        rp.permission.code
    )
    FROM User u
    LEFT JOIN u.userRoles ur
    LEFT JOIN ur.role r
    LEFT JOIN r.rolePermissions rp
    WHERE u.id = :id
    """)
    List<UserDTO> findUserDTOById(@Param("id") Integer id);

}