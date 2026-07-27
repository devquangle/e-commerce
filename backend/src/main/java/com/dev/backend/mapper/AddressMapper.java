package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.address.AddressRequest;
import com.dev.backend.dto.address.AddressResponse;
import com.dev.backend.entity.Address;

@Component
public class AddressMapper {
    public AddressResponse toDTO(Address address) {
        if (address == null) {
            return null;
        }
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setFullName(address.getFullName());
        response.setPhone(address.getPhone());
        response.setProvinceId(address.getProvinceId());
        response.setDistrictId(address.getDistrictId());
        response.setWardCode(address.getWardCode());
        response.setStreet(address.getStreet());   
        response.setDefault(address.isDefault());
        return response;
    }

    public Address toEntityAddress(Address address, AddressRequest request) {
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setStreet(request.getStreet());
        address.setProvinceId(request.getProvinceId());
        address.setDistrictId(request.getDistrictId());
        address.setWardCode(request.getWardCode());
        address.setDefault(request.isDefault());
        return address;
    }

}
