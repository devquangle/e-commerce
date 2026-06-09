package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.response.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/resource")
@RequiredArgsConstructor
public class ApiGoogleBookController {


    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseUtil.success("Lấy danh sách đối tượng thành công", null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return ResponseUtil.success("Lấy chi tiết đối tượng thành công", null);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Object request) {
        return ResponseUtil.success("Thêm đối tượng thành công", null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @Valid @RequestBody Object request) {
        return ResponseUtil.success("Cập nhật đối tượng thành công", null);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
       
        return ResponseUtil.success("Xóa đối tượng thành công", null);
    }
}