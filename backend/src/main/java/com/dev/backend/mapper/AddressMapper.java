package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.AddressDTO;
import com.dev.backend.dto.address.AddressResponse;
import com.dev.backend.entity.Address;
import com.dev.backend.service.GHNService;

@Component
public class AddressMapper {
    private final GHNService ghnService;

    public AddressMapper(GHNService ghnService) {
        this.ghnService = ghnService;
    }

    public AddressResponse toDTO(Address address) {
        if (address == null) {
            return null;
        }
        AddressResponse dto = new AddressResponse();
        dto.setId(address.getId());
        dto.setFullName(address.getFullName());
        dto.setPhone(address.getPhone());
        dto.setProvinceId(address.getProvinceId());
        dto.setDistrictId(address.getDistrictId());
        dto.setWardCode(address.getWardCode());
        dto.setStreet(address.getStreet());
        dto.setStreetFull(ghnService.getStreetFull(address.getProvinceId(), address.getDistrictId(),
                address.getWardCode(), address.getStreet()));
        dto.setDefault(address.isDefault());
        return dto;
    }
}
