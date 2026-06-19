package com.dev.backend.dto.genre;

import com.dev.backend.constant.BaseStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GenreResponse {
    private Integer id;
    private String name;
    private String slug;
    private int totalProduct;
    private BaseStatus status;
    private String urlImage;
}
