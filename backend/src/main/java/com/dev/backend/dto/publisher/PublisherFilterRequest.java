package com.dev.backend.dto.publisher;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PublisherFilterRequest {
    private String keyword;
    private String status;
    private Integer page;
    private Integer size;
}
