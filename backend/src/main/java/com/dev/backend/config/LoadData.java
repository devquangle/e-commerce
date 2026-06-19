package com.dev.backend.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.dev.backend.constant.Permission;
import com.dev.backend.entity.Role;
import com.dev.backend.service.AuthorService;
import com.dev.backend.service.GenreService;
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

    private final UserService userService;
    private final RegisterService registerService;

    private final GenreService genreService;

    private final AuthorService authorService;
    private final PublisherService publisherService;

    private final SeriesService seriesService; 

    @Override
    public void run(org.springframework.boot.ApplicationArguments args) throws Exception {

        if (roleService.isEmpty()) {
            for (Permission p : Permission.values()) {
                Role role = new Role();
                role.setModule(p.getModule());
                role.setCode(p.name());
                role.setName(p.name());
                role.setDescription(p.getDescription());
                roleService.save(role);
            }
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
