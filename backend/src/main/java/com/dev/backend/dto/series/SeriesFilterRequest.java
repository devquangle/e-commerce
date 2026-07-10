package com.dev.backend.dto.series;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeriesFilterRequest {
    private String keyword;
    private String status;
    private Integer page;
    private Integer size;
}
