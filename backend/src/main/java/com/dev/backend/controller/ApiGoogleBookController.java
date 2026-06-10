package com.dev.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.googlebook.GoogleBookResponse;
import com.dev.backend.dto.grop.BookMetadataResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.GoogleBookService;
import com.dev.backend.service.GroqService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class ApiGoogleBookController {

    private final GoogleBookService bookService;
    private final GroqService groqService;

    @GetMapping("/google-books")
    public ResponseEntity<ResponseData<List<GoogleBookResponse>>> search(@RequestParam String query) {
        List<GoogleBookResponse> response = bookService.searchBooks(query);
        return ResponseUtil.success("Lấy dữ liệu thành công", response);
    }
    @PostMapping("/book-metadata")
    public ResponseEntity<ResponseData<BookMetadataResponse>> filter(@RequestParam String name ,@RequestParam List<String> authors,@RequestParam String description) {
        BookMetadataResponse response=groqService.generateMetadata(name, authors, description);
        return ResponseUtil.success("Lấy dữ liệu thành công", response);
    }
    
}