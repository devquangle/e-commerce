package com.dev.backend.controller;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.constant.AuthorType;
import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.mapper.AuthorMapper;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AuthorController {

    @GetMapping("/authors")
    public ResponseEntity<ResponseData<List<AuthorResponse>>> getAuthors() {

        List<AuthorResponse> authorResponses = Arrays.stream(AuthorType.values())
                .sorted(Comparator.comparingInt(AuthorType::getId).reversed())
                .map(AuthorMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseUtil.success("Lấy danh sách tác giả thành công", authorResponses);
    }
}
