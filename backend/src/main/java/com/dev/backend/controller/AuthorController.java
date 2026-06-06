package com.dev.backend.controller;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.constant.AuthorType;
import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.dto.genre.GenreResponse;
import com.dev.backend.mapper.AuthorMapper;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.AuthorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping("/authors/filter")
    public ResponseEntity<ResponseData<PageResponse<AuthorResponse>>> filter(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status)
    {
        PageResponse<AuthorResponse> response = authorService.pages(page - 1, size, keyword, status);
        return ResponseUtil.success("Lấy danh sách tác giả thành công", response);
    }

}
