package com.dev.backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CoverImageRequest {
    private String url;
    private boolean isThumbnail;
    private boolean hasFile;
}
