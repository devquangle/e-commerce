package com.dev.backend.dto.author;

import com.dev.backend.constant.BaseStatus;

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
    private String wikibaseItem;
    private String urlImage;
    private String urlBio;
    private String description;
    private BaseStatus status;

}
