package com.dev.backend.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity<Integer> {
   
    private String fullName;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(length = 10, unique = true)
    private String phone;
    @Column(unique = true)
    private String code;
    @Column(nullable = false)
    private int tokenVersion = 0;
    private String street;
    private String image;
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @Column(nullable = false)
    private boolean enabled = false;
    private boolean accountNonLocked = true;
    private int failedAttempt = 0;
    private LocalDateTime lockTime;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<UserRole> userRoles = new HashSet<>();

    @OneToMany(mappedBy = "user")
    private List<Address> addresses = new ArrayList<>();;

    @OneToMany(mappedBy = "user")
    private List<CartItem> cartItems = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Order> orders = new ArrayList<>();;

    @OneToMany(mappedBy = "user")
    private List<Favorite> favorites = new ArrayList<>();

}
