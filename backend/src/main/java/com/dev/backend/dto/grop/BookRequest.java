package com.dev.backend.dto.grop;

import java.util.List;

import lombok.Data;

@Data
public class BookRequest {
    private String name;
    private List<String> authors;
    private String description;
}
