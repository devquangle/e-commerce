package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.series.ProductSeriesResponse;
import com.dev.backend.dto.series.SeriesResponse;
import com.dev.backend.entity.Series;

@Component
public class SeriesMapper {
    public SeriesResponse toDTO(Series series) {
        if (series == null) {
            return null;
        }
        return SeriesResponse.builder()
                .id(series.getId())
                .name(series.getName())
                .slug(series.getSlug())
                .status(series.getStatus())
                .description(series.getDescription())
                .build();
    }

    public ProductSeriesResponse toProductSeries(Series series) {
        if (series == null) {
            return null;
        }
        ProductSeriesResponse dto = new ProductSeriesResponse();
        dto.setId(series.getId());
        dto.setName(series.getName());
        dto.setSlug(series.getSlug());
        return dto;
    }

}
