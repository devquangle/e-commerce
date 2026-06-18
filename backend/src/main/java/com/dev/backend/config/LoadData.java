package com.dev.backend.config;

import java.util.List;

import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.dev.backend.constant.PermissionEnum;
import com.dev.backend.constant.RoleName;
import com.dev.backend.entity.Permission;
import com.dev.backend.entity.Role;
import com.dev.backend.service.AuthorService;
import com.dev.backend.service.GenreService;
import com.dev.backend.service.PermissionService;
import com.dev.backend.service.PublisherService;
import com.dev.backend.service.RegisterService;
import com.dev.backend.service.RoleService;
import com.dev.backend.service.SeriesService;
import com.dev.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LoadData implements ApplicationRunner {
    private final RoleService roleService;
    private final PermissionService permissionService;

    private final UserService userService;
    private final RegisterService registerService;

    private final GenreService genreService;

    private final AuthorService authorService;
    private final PublisherService publisherService;

    private final SeriesService seriesService; 

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
                Role role = new Role();
                role.setName(roleName.name());
                role.setDescription(description);
                roleService.save(role);
            });
        }
        if (permissionService.isEmpty()) {
            for (PermissionEnum p : PermissionEnum.values()) {
                String code = p.getCode();
                String description = "Module: " + p.getModule() + ", Action: " + p.getAction();
                Permission permission = new Permission();
                permission.setCode(code);
                permission.setDescription(description);
                permission.setName(code);
                permission.setModule(p.getModule().name());
                permissionService.save(permission);
            }
        }

        long permissionsCount = roleService.findAll().stream().mapToLong(r -> r.getPermissions().size()).sum();
        if (permissionsCount == 0) {
            roleService.findAll().forEach(role -> {
                switch (RoleName.valueOf(role.getName())) {
                    case SUPER_ADMIN, ADMIN -> {
                        permissionService.findAll().forEach(permission -> {
                            role.getPermissions().add(permission);
                        });
                    }
                    case MANAGER_PRODUCT -> {
                        role.getPermissions().add(permissionService.findByCode("PRODUCT_CREATE"));
                        role.getPermissions().add(permissionService.findByCode("PRODUCT_READ"));
                        role.getPermissions().add(permissionService.findByCode("PRODUCT_UPDATE"));

                    }
                    case MANAGER_ORDER -> {
                        role.getPermissions().add(permissionService.findByCode("ORDER_READ"));
                        role.getPermissions().add(permissionService.findByCode("ORDER_UPDATE"));
                    }
                    case MANAGER_GENRE -> {
                        role.getPermissions().add(permissionService.findByCode("GENRE_CREATE"));
                        role.getPermissions().add(permissionService.findByCode("GENRE_READ"));
                        role.getPermissions().add(permissionService.findByCode("GENRE_UPDATE"));

                    }
                    case MANAGER_PROMOTION -> {
                        role.getPermissions().add(permissionService.findByCode("PROMOTION_CREATE"));
                        role.getPermissions().add(permissionService.findByCode("PROMOTION_READ"));
                        role.getPermissions().add(permissionService.findByCode("PROMOTION_UPDATE"));
                        role.getPermissions().add(permissionService.findByCode("PROMOTION_REPORT"));
                    }
                    case CONTENT_EDITOR -> {
                        role.getPermissions().add(permissionService.findByCode("CONTENT_UPDATE"));
                        role.getPermissions().add(permissionService.findByCode("CONTENT_READ"));
                    }
                    case SUPPORT -> {
                        role.getPermissions().add(permissionService.findByCode("ORDER_READ"));
                        role.getPermissions().add(permissionService.findByCode("SUPPORT_TASK"));
                        role.getPermissions().add(permissionService.findByCode("CUSTOMER_RESET_PASSWORD"));
                    }
                    case CUSTOMER -> {

                    }
                }
                roleService.save(role);
            });
        }

        if (userService.isEmpty()) {
            registerService.setUp();
        }

        genreService.insertData();
        authorService.insertData();
        publisherService.insertData();

        seriesService.insertData();

    }

}
