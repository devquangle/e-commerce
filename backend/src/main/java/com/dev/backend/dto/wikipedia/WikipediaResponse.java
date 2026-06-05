package com.dev.backend.dto.wikipedia;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WikipediaResponse {

    private String title;

    private String wikibaseItem;
    private String urlImage;
    private String urlBio;
    private String extract;
}