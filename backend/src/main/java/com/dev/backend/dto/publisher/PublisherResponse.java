package com.dev.backend.dto.publisher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PublisherResponse {
    private int id;
    private String name;
    private String displayName;
}
