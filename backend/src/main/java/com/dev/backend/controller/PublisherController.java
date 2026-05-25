package com.dev.backend.controller;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.constant.PublisherType;
import com.dev.backend.dto.publisher.PublisherResponse;
import com.dev.backend.mapper.PublisherMapper;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class PublisherController {
    @GetMapping("/publishers")
    public ResponseEntity<ResponseData<List<PublisherResponse>>> getPublishers() {

        List<PublisherResponse> PublisherResponses = Arrays.stream(PublisherType.values())
                .sorted(Comparator.comparingInt(PublisherType::getId).reversed())
                .map(PublisherMapper::toDTO)
                .collect(Collectors.toList());

        return ResponseUtil.success("Lấy danh sách nhà xuất bản thành công", PublisherResponses);
    }
}
