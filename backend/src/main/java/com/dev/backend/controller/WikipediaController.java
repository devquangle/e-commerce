package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.wikipedia.WikipediaResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.WikipediaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class WikipediaController {
    private final WikipediaService wikipediaService;

    @GetMapping("/wikipedia")
    public ResponseEntity<ResponseData<WikipediaResponse>> search(@RequestParam String name) {
        WikipediaResponse response = wikipediaService.fetchApiInforAuthor(name);
        return ResponseUtil.success("Lấy dữ liệu thành công", response);
    }

}
