package com.dev.backend.dto.ghn;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GHNResponse<T> {
    private int code;
    private String message;
    private List<T> data;
}
