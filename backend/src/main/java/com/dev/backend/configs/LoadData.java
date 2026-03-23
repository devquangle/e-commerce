package com.dev.backend.configs;

import java.util.List;

import com.dev.backend.services.*;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.dev.backend.entities.Permission;
import com.dev.backend.entities.Role;
import com.dev.backend.enums.PermissionEnum;
import com.dev.backend.enums.RoleName;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LoadData implements ApplicationRunner {
    private final RoleService roleService;
    private final PermissionService permissionService;
    private final RolePermissionService rolePermissionService;

    private final UserService userService;
    private final  RegisterService registerService;

    @Override
    public void run(org.springframework.boot.ApplicationArguments args) throws Exception {

        if (roleService.isEmpty()) {
            List.of(RoleName.values()).forEach(roleName -> {
                String description = switch (roleName) {
                    case SUPER_ADMIN -> "Quản trị toàn hệ thống";
                    case ADMIN -> "Quản trị viên";
                    case MANAGER_PRODUCT -> "Quản lý sản phẩm";
                    case MANAGER_ORDER -> "Quản lý đơn hàng";
                    case MANAGER_GENRE -> "Quản lý danh mục";
                    case MANAGER_PROMOTION -> "Quản lý khuyến mãi";
                    case CONTENT_EDITOR -> "Biên tập nội dung";
                    case SUPPORT -> "Hỗ trợ khách hàng";
                    case CUSTOMER -> "Người dùng";
                };
                roleService.save(new Role(null, roleName.name(), description, null, null));
            });
        }
        if (permissionService.isEmpty()) {
            for (PermissionEnum p : PermissionEnum.values()) {
                String code = p.getCode();
                String description = "Module: " + p.getModule() + ", Action: " + p.getAction();
                permissionService.save(new Permission(null, code, description, p.getModule(), p.getAction(), null));
            }
        }

        if (rolePermissionService.isEmpty()){
            roleService.findAll().forEach(role -> {
                switch (RoleName.valueOf(role.getName())) {
                    case SUPER_ADMIN, ADMIN -> {
                        permissionService.findAll().forEach(permission -> {
                            rolePermissionService.addPermission(role, permission);
                        });
                    }
                    case MANAGER_PRODUCT -> {
                        rolePermissionService.addPermission(role, permissionService.findByCode("PRODUCT_CREATE"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("PRODUCT_READ"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("PRODUCT_UPDATE"));

                    }
                    case MANAGER_ORDER -> {
                        rolePermissionService.addPermission(role, permissionService.findByCode("ORDER_READ"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("ORDER_UPDATE"));
                    }
                    case MANAGER_GENRE -> {
                        rolePermissionService.addPermission(role, permissionService.findByCode("GENRE_CREATE"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("GENRE_READ"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("GENRE_UPDATE"));

                    }
                    case MANAGER_PROMOTION -> {
                        rolePermissionService.addPermission(role, permissionService.findByCode("PROMOTION_CREATE"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("PROMOTION_READ"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("PROMOTION_UPDATE"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("PROMOTION_REPORT"));
                    }
                    case CONTENT_EDITOR -> {
                        rolePermissionService.addPermission(role, permissionService.findByCode("CONTENT_UPDATE"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("CONTENT_READ"));
                    }
                    case SUPPORT -> {
                        rolePermissionService.addPermission(role, permissionService.findByCode("ORDER_READ"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("SUPPORT_TASK"));
                        rolePermissionService.addPermission(role, permissionService.findByCode("CUSTOMER_RESET_PASSWORD"));
                    }
                    case CUSTOMER -> {

                    }
                }
            });
        }

        if (userService.isEmpty()){
            registerService.setUp();
        }


      

    }

}
