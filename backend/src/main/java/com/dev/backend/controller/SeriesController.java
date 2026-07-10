package com.dev.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.series.SeriesFilterRequest;
import com.dev.backend.dto.series.SeriesRequest;
import com.dev.backend.dto.series.SeriesResponse;
import com.dev.backend.dto.series.SeriesWithProductCountResponse;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.SeriesService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class SeriesController {
    private final SeriesService seriesService;

    @GetMapping("/series")
    public ResponseEntity<ResponseData<List<SeriesWithProductCountResponse>>> list() {
        List<SeriesWithProductCountResponse> items = seriesService.findActiveSeriesWithProductCount();
        return ResponseUtil.success("Lấy danh sách thể loại thành công", items);
    }

    @GetMapping("/admin/series/filter")
    public ResponseEntity<ResponseData<PageResponse<SeriesResponse>>> filter(
        @ModelAttribute SeriesFilterRequest request) {
        PageResponse<SeriesResponse> response = seriesService.search(request);
        return ResponseUtil.success("Lấy danh sách bộ truyện thành công", response);
    }

    @PostMapping("/admin/series")
    public ResponseEntity<ResponseData<SeriesResponse>> add(@RequestBody SeriesRequest seriesRequest) {
        SeriesResponse response = seriesService.add(seriesRequest);
        return ResponseUtil.success("Thêm bộ truyện  thành công.", response);
    }

    @PutMapping("/admin/series/{id}")
    public ResponseEntity<ResponseData<SeriesResponse>> update(@PathVariable Integer id,
            @RequestBody SeriesRequest seriesRequest) {
        SeriesResponse response = seriesService.update(id, seriesRequest);
        return ResponseUtil.success("Cập nhật bộ truyện thành công.", response);
    }

    @DeleteMapping("/admin/series/{id}")
    public ResponseEntity<ResponseData<Void>> delete(@PathVariable Integer id) {
        seriesService.delete(id);
        return ResponseUtil.success("Xoá bộ truyện thành công.", null);
    }
}
