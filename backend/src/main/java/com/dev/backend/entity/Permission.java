package com.dev.backend.entity;

import java.util.ArrayList;
import java.util.List;

import com.dev.backend.constant.ActionType;
import com.dev.backend.constant.Module;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(unique = true)
    private String code;
    private String description;
    @Enumerated(EnumType.STRING)
    private Module module;
    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    @OneToMany(mappedBy = "permission")
    private List<RolePermission> rolePermissions = new ArrayList<>();

}
