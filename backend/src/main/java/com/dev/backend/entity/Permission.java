package com.dev.backend.entity;

import java.util.HashSet;
import java.util.Set;

import com.dev.backend.constant.ActionType;
import com.dev.backend.constant.Module;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "permissions")
public class Permission extends BaseEntity<Integer> {

    @Column(unique = true)
    private String code;
    private String description;
    @Enumerated(EnumType.STRING)
    private Module module;
    @Enumerated(EnumType.STRING)
    private ActionType actionType;

  @OneToMany(mappedBy = "permission", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<RolePermission> rolePermissions = new HashSet<>();

}
