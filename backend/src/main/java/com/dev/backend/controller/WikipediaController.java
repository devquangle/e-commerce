package com.dev.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.gemini.BookMeta;
import com.dev.backend.dto.searchapi.UrlImageResponse;
import com.dev.backend.dto.wikipedia.WikipediaResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.GeminiService;
import com.dev.backend.service.SearchApiService;

import com.dev.backend.service.WikipediaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class WikipediaController {
    private final WikipediaService wikipediaService;
    private final SearchApiService searchApiService;
    private final GeminiService geminiService;

    @GetMapping("/wikipedia")
    public ResponseEntity<ResponseData<WikipediaResponse>> search(@RequestParam String name) {
        WikipediaResponse response = wikipediaService.fetchApiInforAuthor(name);
        return ResponseUtil.success("Lấy dữ liệu thành công", response);
    }

    @GetMapping("/book-images")
    public ResponseEntity<ResponseData<UrlImageResponse>> getUrlImages(@RequestParam String name) {
        UrlImageResponse images = searchApiService.getTop5ImageLinks(name);
        return ResponseUtil.success("Lấy dữ liệu thành công", images);
    }

    @GetMapping("/book-meta")
    public ResponseEntity<ResponseData<BookMeta>> getBookMeta(@RequestParam String name,
            @RequestParam List<String> authors) {
        BookMeta bookMeta = geminiService.generateBookMeta(name, authors);
        return ResponseUtil.success("Lấy dữ liệu thành công", bookMeta);
    }

}
