package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.address.AddressRequest;
import com.dev.backend.dto.address.AddressResponse;
import com.dev.backend.entity.Address;

public interface AddressService {
    List<AddressResponse> getListAddressByUserId(Integer userId);

    AddressResponse getAddressDTOByIdAndUserId(Integer addressId, Integer userId);

    AddressResponse savAddress(AddressRequest request, Integer userId);

    AddressResponse updateAddress(Integer addressId, AddressRequest request, Integer userId);

    int countAddressByUser(Integer userId);

    Address getAddressByIdAndUserId(Integer addressId, Integer userId);

    void deleteAddress(Integer addressId, Integer userId);

    void defaultAddress(Integer addressId, Integer userId);

    AddressResponse toAddressResponse(Address address);
}
