package com.dev.backend.dto.author;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AuthorResponse {
    private int id;
    private String name;
    private String displayName;
    private String urlImage;
    private String urlBio;

}
