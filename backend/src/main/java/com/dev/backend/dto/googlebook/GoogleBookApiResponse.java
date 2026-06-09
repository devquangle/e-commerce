package com.dev.backend.dto.googlebook;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleBookApiResponse {
    
    private Integer id;
    private String name;
    private List<String> authors;
}