package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

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
                .slug(series.getSlug())
                .status(series.getStatus())
                .description(series.getDescription())
                .build();
    }
}
