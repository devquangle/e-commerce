package com.dev.backend.dto;

public record UserRP(
                Integer id,
                int tokenVersion,
                String fullName,
                String email,
                String password,
                String phone,
                String code,
                String street,
                String image,
                boolean enabled,
                boolean accountNonLocked,
                String roleName,
                String permissionCode) {
}