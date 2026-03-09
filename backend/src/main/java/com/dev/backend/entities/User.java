package com.dev.backend.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String fullName;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(length = 10)
    private String phone;
    private String street;
    private String image;
    private int failCount;
    private LocalDateTime createAt = LocalDateTime.now();
    private LocalDateTime updateAt;
    private LocalDateTime lockAt;
    private boolean active;

    @OneToMany(mappedBy = "user")
    private List<UserRole> userRoles = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Address> addresses = new ArrayList<>();;

    @OneToMany(mappedBy = "user")
    private List<CartItem> cartItems = new ArrayList<>();;

    @OneToMany(mappedBy = "user")
    private List<Order> orders = new ArrayList<>();;

    @OneToMany(mappedBy = "user")
    private List<Favorite> favorites = new ArrayList<>();

}
