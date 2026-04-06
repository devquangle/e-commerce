package com.dev.backend.service;

import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.bean.ProfileBean;
import com.dev.backend.dto.UserDTO;
import com.dev.backend.entity.User;
import com.dev.backend.security.CustomUserDetails;

public interface UserService {

    Object userDTO(String token);

    UserDTO dto(CustomUserDetails userDetails);

    User saveUser(User user);

    User getUserByEmail(String email);

    User getUserById(Integer id);

    User getUserByToken(String token);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByCode(String code);

    boolean isEmpty();

    void processLoginFail(Integer id);

    void resetFailedAttempts(Integer id);

    UserDTO updateProfile(ProfileBean profileBean, CustomUserDetails userDetails, MultipartFile image);

    void validateUnique(ProfileBean profileBean, User user);

}