package com.dev.backend.dto.ghn;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CalculateFeeRequest {
    private String toWardCode;
    private Integer toDistrictId;
    private Integer weight;
}
