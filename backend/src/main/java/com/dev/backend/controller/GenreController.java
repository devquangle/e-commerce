package com.dev.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.genre.GenreRequest;
import com.dev.backend.dto.genre.GenreResponse;
import com.dev.backend.resp.PageResponse;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;
import com.dev.backend.service.GenreService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class GenreController {
    private final GenreService genreService;

    @GetMapping("/genres")
    public ResponseEntity<ResponseData<PageResponse<GenreResponse>>> pageGenre(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        PageResponse<GenreResponse> pageGenre = genreService.pageGenre(page-1, size, keyword);
        return ResponseUtil.success("Load thể loại thành công", pageGenre);

    }

    @PostMapping("/genres")
    public ResponseEntity<ResponseData<List<GenreResponse>>> post_genre(
            @RequestBody GenreRequest genreRequest) {
        genreService.addGenre(genreRequest);
        return ResponseUtil.success("Thêm thể loại thành công", null);
    }
}
