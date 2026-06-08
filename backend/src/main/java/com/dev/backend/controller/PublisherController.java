package com.dev.backend.controller;



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

import com.dev.backend.dto.publisher.PublisherRequest;
import com.dev.backend.dto.publisher.PublisherResponse;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.PublisherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class PublisherController {
    private final PublisherService publisherService;

    @GetMapping("/publishers/filter")
    public ResponseEntity<ResponseData<PageResponse<PublisherResponse>>> filter(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        PageResponse<PublisherResponse> response = publisherService.pages(page - 1, size, keyword, status);
        return ResponseUtil.success("Lấy danh sách nhà xuất bản thành công", response);
    }

    @PostMapping("/publishers")
    public ResponseEntity<ResponseData<PublisherResponse>> add(@RequestBody PublisherRequest publisherRequest) {
        PublisherResponse response = publisherService.add(publisherRequest);
        return ResponseUtil.success("Thêm nhà xuất bản  thành công.", response);
    }

    @PutMapping("/publishers/{id}")
    public ResponseEntity<ResponseData<PublisherResponse>> update(@PathVariable Integer id,
            @RequestBody PublisherRequest publisherRequest) {
        PublisherResponse response = publisherService.update(id, publisherRequest);
        return ResponseUtil.success("Cập nhật nhà xuất bản  thành công.", response);
    }

    @DeleteMapping("/publishers/{id}")
    public ResponseEntity<ResponseData<Void>> delete(@PathVariable Integer id) {
        publisherService.delete(id);
        return ResponseUtil.success("Xoá nhà xuất bản  thành công.", null);
    }
}
