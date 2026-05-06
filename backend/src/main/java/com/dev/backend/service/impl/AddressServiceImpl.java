package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.bean.AddressBean;
import com.dev.backend.dto.AddressDTO;
import com.dev.backend.entity.Address;
import com.dev.backend.entity.User;
import com.dev.backend.exception.AppException;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.AddressMapper;
import com.dev.backend.repository.AddressRepository;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.service.AddressService;
import com.dev.backend.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;
    private final UserService userService;

    @Override
    public int count(CustomUserDetails userDetails) {
        User user = userService.userIsLogin(userDetails);
        return addressRepository.countByUserId(user.getId());
    }

    @Override
    public Address getAddressByIdAndUserId(Integer addressId, CustomUserDetails userDetails) {
        Integer userId = userService.userIsLogin(userDetails).getId();
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new NotFoundException("ADDRESS NOT FOUND"));
        return address;
    }

    @Override
    public void deleteAddress(Integer addressId, CustomUserDetails userDetails) {
        Integer userId = userService.userIsLogin(userDetails).getId();
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new NotFoundException("ADDRESS NOT FOUND"));
        addressRepository.delete(address);
    }

    @Override
    public AddressDTO getAddressDTOByIdAndUserId(Integer addressId, CustomUserDetails userDetails) {
        Address address = getAddressByIdAndUserId(addressId, userDetails);
        return addressMapper.toDTO(address);
    }



    @Override
    public List<AddressDTO> getListAddressByUserId(CustomUserDetails userDetails) {
        List<Address> addresses = addressRepository
                .findByUserId(userDetails.getUser().getId());

        if (addresses == null || addresses.isEmpty()) {
            return List.of();
        }

        return addresses.stream()
                .map(addressMapper::toDTO)
                .toList();
    }

   
    @Override
    @Transactional
    public AddressDTO savAddress(AddressBean addressBean, CustomUserDetails userDetails) {
        User user = userService.userIsLogin(userDetails);
        Integer userId = userService.userIsLogin(userDetails).getId();
        if (count(userDetails) >= 6) {
            throw new AppException(422, "Bạn chỉ được lưu tối đa 6 địa chỉ");
        }

        if (addressBean.isDefault()) {
            addressRepository.clearDefaultOnly(userId);
        }
        Address address = new Address();
        address.setFullName(addressBean.getFullName());
        address.setPhone(addressBean.getPhone());
        address.setProvinceId(addressBean.getProvinceId());
        address.setDistrictId(addressBean.getDistrictId());
        address.setWardCode(addressBean.getWardCode());
        address.setStreet(addressBean.getStreet());
        address.setDefault(addressBean.isDefault());
        address.setUser(user);
        addressRepository.save(address);
        return addressMapper.toDTO(address);
    }

    @Override
    @Transactional
    public AddressDTO updateAddress(Integer addressId, AddressBean addressBean, CustomUserDetails userDetails) {
        Integer userId = userService.userIsLogin(userDetails).getId();
        Address address = getAddressByIdAndUserId(addressId, userDetails);
        if (addressBean.isDefault()) {
            addressRepository.clearDefaultOnly(userId);
        }
        address.setFullName(addressBean.getFullName());
        address.setPhone(addressBean.getPhone());
        address.setProvinceId(addressBean.getProvinceId());
        address.setDistrictId(addressBean.getDistrictId());
        address.setWardCode(addressBean.getWardCode());
        address.setStreet(addressBean.getStreet());
        address.setDefault(addressBean.isDefault());
        addressRepository.save(address);
        return addressMapper.toDTO(address);
    }

    @Override
    @Transactional
    public void defaultAddress(Integer addressId, CustomUserDetails userDetails) {
        Integer userId = userService.userIsLogin(userDetails).getId();
        Address address = getAddressByIdAndUserId(addressId, userDetails);
        addressRepository.clearDefaultOnly(userId);
        address.setDefault(true);
        addressRepository.save(address);
    }

}
