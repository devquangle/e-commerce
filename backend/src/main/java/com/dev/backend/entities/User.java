package com.dev.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User {
    private Integer id;
    private String fullName;
    private String email;
    private String password;
    private String avatar;
    private String address;
    private int role;

}
