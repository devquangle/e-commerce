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
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.author.AuthorRequest;
import com.dev.backend.dto.author.AuthorResponse;
import com.dev.backend.dto.author.AuthorWithProductCountResponse;
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


     @GetMapping("/authors")
    public ResponseEntity<ResponseData<List<AuthorWithProductCountResponse>>> list() {
        List<AuthorWithProductCountResponse> items = authorService.findActiveAuthorsWithProductCount();
        return ResponseUtil.success("Lấy danh sách tác giả thành công", items);
    }


    @GetMapping("/authors/filter")
    public ResponseEntity<ResponseData<PageResponse<AuthorResponse>>> filter(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        PageResponse<AuthorResponse> response = authorService.pages(page - 1, size, keyword, status);
        return ResponseUtil.success("Lấy danh sách tác giả thành công", response);
    }

    @PostMapping("/authors")
    public ResponseEntity<ResponseData<AuthorResponse>> add(@RequestBody AuthorRequest authorRequest) {
        AuthorResponse response = authorService.add(authorRequest);
        return ResponseUtil.success("Thêm tác giả thành công.", response);
    }

    @PutMapping("/authors/{id}")
    public ResponseEntity<ResponseData<AuthorResponse>> update(@PathVariable Integer id,
            @RequestBody AuthorRequest authorRequest) {
        AuthorResponse response = authorService.update(id, authorRequest);
        return ResponseUtil.success("Cập nhật tác giả thành công.", response);
    }

    @DeleteMapping("/authors/{id}")
    public ResponseEntity<ResponseData<Void>> delete(@PathVariable Integer id) {
        authorService.delete(id);
        return ResponseUtil.success("Cập nhật tác giả thành công.", null);
    }

}
