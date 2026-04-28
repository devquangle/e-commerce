package com.dev.backend.service;

import java.util.List;

import com.dev.backend.bean.AddressBean;
import com.dev.backend.dto.AddressDTO;
import com.dev.backend.entity.Address;
import com.dev.backend.security.CustomUserDetails;

public interface AddressService {
    List<AddressDTO> getListAddressByUserId(CustomUserDetails userDetails);

    Address getAddressById(Integer addressId);

    AddressDTO getDefaultAddressByUserId(CustomUserDetails userDetails);

    AddressDTO savAddress(AddressBean addressBean,CustomUserDetails userDetails);

    AddressDTO updateAddress(AddressBean addressBean);

    int count(CustomUserDetails userDetails);
    boolean isEmpty();
    void deleteAddress(Integer addressId);
}
