package com.dev.backend.dto.genre;

import com.dev.backend.constant.BaseStatus;
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
    private BaseStatus status = BaseStatus.ACTIVE;
    private String previewImageUrl;
}
