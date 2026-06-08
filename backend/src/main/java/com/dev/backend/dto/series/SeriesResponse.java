package com.dev.backend.dto.series;

import com.dev.backend.constant.BaseStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SeriesResponse {
    private Integer id;
    private String name;
    private String slug;
    private String description;
    private BaseStatus status;
}
