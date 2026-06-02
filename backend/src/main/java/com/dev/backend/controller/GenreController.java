package com.dev.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.dto.genre.GenreRequest;
import com.dev.backend.dto.genre.GenreResponse;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
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
        PageResponse<GenreResponse> pageGenre = genreService.pageGenre(page - 1, size, keyword);
        return ResponseUtil.success("Load thể loại thành công", pageGenre);

    }

    @PostMapping("/genres")
    public ResponseEntity<ResponseData<GenreResponse>> post_genre(
            @RequestPart("data") GenreRequest genreRequest,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        GenreResponse addGenre = genreService.addGenre(genreRequest, image);
        return ResponseUtil.success("Thêm thể loại thành công", addGenre);
    }

    @PutMapping("/genres/{id}")
    public ResponseEntity<ResponseData<GenreResponse>> put_genre(
            @PathVariable Integer id,
            @RequestBody GenreRequest genreRequest,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        GenreResponse updateGenre = genreService.updateGenre(id, genreRequest, image);
        return ResponseUtil.success("Cập nhật thể loại thành công", updateGenre);
    }

    @DeleteMapping("/genres/{id}")
    public ResponseEntity<ResponseData<Void>> delete_genre(@PathVariable Integer id) {
        genreService.delete(id);
        return ResponseUtil.success("Xóa thể loại thành công", null);
    }

    @GetMapping("/genres/all")
    public ResponseEntity<ResponseData<List<GenreResponse>>> listGenre() {
        List<GenreResponse> listGenre = genreService.getAllGenre();
        return ResponseUtil.success("Lấy danh sách thể loại thành công", listGenre);
    }

}
