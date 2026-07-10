package com.dev.backend.dto.product;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductSearchRequest {
    private String keyword;
    private String status;
    private Integer page;
    private Integer size;
}
