package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.bean.AddressBean;
import com.dev.backend.dto.address.AddressResponse;
import com.dev.backend.entity.Address;
import com.dev.backend.exception.AppException;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.AddressMapper;
import com.dev.backend.repository.AddressRepository;
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
    public int count(Integer userId) {
        return addressRepository.countByUserId(userId);
    }

    @Override
    public Address getAddressByIdAndUserId(Integer addressId, Integer userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new NotFoundException("ADDRESS NOT FOUND"));
        return address;
    }

    @Override
    public void deleteAddress(Integer addressId, Integer userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new NotFoundException("ADDRESS NOT FOUND"));
        addressRepository.delete(address);
    }

    @Override
    public AddressResponse getAddressDTOByIdAndUserId(Integer addressId, Integer userId) {
        Address address = getAddressByIdAndUserId(addressId, userId);
        return addressMapper.toDTO(address);
    }

    @Override
    public List<AddressResponse> getListAddressByUserId(Integer userId) {
        List<Address> addresses = addressRepository
                .findByUserId(userId);

        if (addresses == null || addresses.isEmpty()) {
            return List.of();
        }

        return addresses.stream()
                .map(addressMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public AddressResponse savAddress(AddressBean addressBean, Integer userId) {
        if (count(userId) >= 6) {
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
        address.setUser(userService.getUserById(userId));
        addressRepository.save(address);
        return addressMapper.toDTO(address);
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Integer addressId, AddressBean addressBean, Integer userId) {
        Address address = getAddressByIdAndUserId(addressId, userId);
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
    public void defaultAddress(Integer addressId, Integer userId) {
        Address address = getAddressByIdAndUserId(addressId, userId);
        addressRepository.clearDefaultOnly(userId);
        address.setDefault(true);
        addressRepository.save(address);
    }

}
