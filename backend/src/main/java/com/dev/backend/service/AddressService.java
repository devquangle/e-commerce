package com.dev.backend.service;

import java.util.List;

import com.dev.backend.bean.AddressBean;
import com.dev.backend.dto.AddressDTO;
import com.dev.backend.entity.Address;
import com.dev.backend.security.CustomUserDetails;

public interface AddressService {
    List<AddressDTO> getListAddressByUserId(CustomUserDetails userDetails);

    AddressDTO getAddressDTOByIdAndUserId(Integer addressId, CustomUserDetails userDetails);

    AddressDTO getDefaultAddressByUserId(CustomUserDetails userDetails);

    AddressDTO savAddress(AddressBean addressBean, CustomUserDetails userDetails);

    AddressDTO updateAddress(Integer addressId,AddressBean addressBean,CustomUserDetails userDetails);

    int count(CustomUserDetails userDetails);

    boolean isEmpty();

   Address getAddressByIdAndUserId(Integer addressId,CustomUserDetails userDetails);


    void deleteAddress(Integer addressId,CustomUserDetails userDetails);
}
