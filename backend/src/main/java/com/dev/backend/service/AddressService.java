package com.dev.backend.service;

import java.util.List;

import com.dev.backend.bean.AddressBean;
import com.dev.backend.dto.address.AddressResponse;
import com.dev.backend.entity.Address;

public interface AddressService {
    List<AddressResponse> getListAddressByUserId(Integer userId);

    AddressResponse getAddressDTOByIdAndUserId(Integer addressId, Integer userId);

    AddressResponse savAddress(AddressBean addressBean, Integer userId);

    AddressResponse updateAddress(Integer addressId, AddressBean addressBean, Integer userId);

    int count(Integer userId);

    Address getAddressByIdAndUserId(Integer addressId, Integer userId);

    void deleteAddress(Integer addressId, Integer userId);

    void defaultAddress(Integer addressId, Integer userId);

}
