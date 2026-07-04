package com.dev.backend.dto.publisher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductPublisherResponse {
    private Integer id;
    private String name;
    private String slug;
}
