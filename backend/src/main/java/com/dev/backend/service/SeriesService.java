package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.series.SeriesRequest;
import com.dev.backend.dto.series.SeriesResponse;
import com.dev.backend.dto.series.SeriesWithProductCountResponse;
import com.dev.backend.entity.Series;
import com.dev.backend.response.PageResponse;

public interface SeriesService {
    void validate(SeriesRequest seriesRequest);

    List<SeriesResponse> findAll();

    void insertData();

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    Series save(Series series);

    Series findById(Integer id);

    SeriesResponse add(SeriesRequest SeriesRequest);

    SeriesResponse update(Integer id, SeriesRequest SeriesRequest);

    void delete(Integer id);

    PageResponse<SeriesResponse> pages(int page, int size, String keyword, String status);

    List<SeriesWithProductCountResponse> findActiveSeriesWithProductCount();
}
