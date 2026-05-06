package com.dev.backend.bean;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressBean {
    private String fullName;
    private String phone;
    private String street;
    private Integer provinceId;
    private Integer districtId;
    private String wardCode;
    @JsonProperty("default")
    private boolean isDefault = false;

}
