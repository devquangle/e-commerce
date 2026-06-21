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
import com.dev.backend.dto.genre.GenreWithProductCountResponse;
import com.dev.backend.dto.genre.UserGenreResponse;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.ExcelService;
import com.dev.backend.service.GenreService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class GenreController {
    private final GenreService genreService;
    private final ExcelService excelService;

    @GetMapping("/genres")
    public ResponseEntity<ResponseData<List<GenreWithProductCountResponse>>> list() {
        List<GenreWithProductCountResponse> items = genreService.findActiveGenresWithProductCount();
        return ResponseUtil.success("Lấy danh sách thể loại thành công", items);
    }

    @PostMapping("/admin/genres")
    public ResponseEntity<ResponseData<GenreResponse>> post_genre(
            @RequestBody GenreRequest genreRequest) {
        GenreResponse addGenre = genreService.addGenre(genreRequest);
        return ResponseUtil.success("Thêm thể loại thành công", addGenre);
    }

    @PutMapping("/admin/genres/{id}")
    public ResponseEntity<ResponseData<GenreResponse>> put_genre(
            @PathVariable Integer id,
            @RequestBody GenreRequest genreRequest) {
        GenreResponse updateGenre = genreService.updateGenre(id, genreRequest);
        return ResponseUtil.success("Cập nhật thể loại thành công", updateGenre);
    }

    @DeleteMapping("/admin/genres/{id}")
    public ResponseEntity<ResponseData<Void>> delete_genre(@PathVariable Integer id) {
        genreService.delete(id);
        return ResponseUtil.success("Xóa thể loại thành công", null);
    }

    @GetMapping("/admin/genres/filter")
    public ResponseEntity<ResponseData<PageResponse<GenreResponse>>> pageGenre(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        PageResponse<GenreResponse> pageGenre = genreService.pageGenre(page - 1, size, keyword, status);
        return ResponseUtil.success("Load thể loại thành công", pageGenre);

    }

    @PostMapping("/admin/genres/import")
    public ResponseEntity<ResponseData<Integer>> post_genre_import(
            @RequestPart(value = "file") MultipartFile file) {
        int importedCount = excelService.importGenresFromExcel(file);

        if (importedCount > 0) {
            return ResponseUtil.success("Đã thêm thành công " + importedCount + " thể loại mới", importedCount);
        } else {
            return ResponseUtil.success("Không có thể loại mới nào được thêm (Tất cả đều đã tồn tại)", 0);
        }
    }

}
