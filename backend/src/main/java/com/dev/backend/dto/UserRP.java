package com.dev.backend.dto;

public record UserRP(
                Integer id,
                String fullName,
                String email,
                String password,
                String phone,
                String code,
                String street,
                String image,
                String roleName,
                String permissionCode) {
}