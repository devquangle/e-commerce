package com.dev.backend.dto.author;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductAuthorsResponse {
    private Integer id;
    private String name;
    private String slug;
}
