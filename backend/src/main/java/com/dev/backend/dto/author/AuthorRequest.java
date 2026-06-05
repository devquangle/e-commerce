package com.dev.backend.dto.author;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AuthorRequest {
    private String name;
    private String wikibaseItem;
    private String urlImage;
    private String urlBio;
    private String extract;
}
