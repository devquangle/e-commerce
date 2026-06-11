package com.dev.backend.dto.product;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductImageResponse {
    private String url;
    private boolean isThumbnail;
}
