package com.dev.backend.dto.genre;

import com.dev.backend.constant.GenreStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GenreRequest {
    private String name;
    private GenreStatus status = GenreStatus.ACTIVE;
    private String previewImageUrl;
}
