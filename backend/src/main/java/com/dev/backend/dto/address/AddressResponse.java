package com.dev.backend.dto.address;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressResponse {
    private Integer id;
    private String fullName;
    private String phone;
    private Integer provinceId;
    private Integer districtId;
    private String wardCode;
    private String street;
    private String streetFull;
    @JsonProperty("default")
    private boolean isDefault;
}
