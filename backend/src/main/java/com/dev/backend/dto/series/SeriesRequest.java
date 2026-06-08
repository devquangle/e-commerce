package com.dev.backend.dto.series;

import com.dev.backend.constant.BaseStatus;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SeriesRequest {
    private String name;
    private String description;
    private BaseStatus status;
}
