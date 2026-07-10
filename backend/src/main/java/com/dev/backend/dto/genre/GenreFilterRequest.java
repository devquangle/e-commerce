package com.dev.backend.dto.genre;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenreFilterRequest {
    private String keyword;
    private String status;
    private Integer page;
    private Integer size;
}
