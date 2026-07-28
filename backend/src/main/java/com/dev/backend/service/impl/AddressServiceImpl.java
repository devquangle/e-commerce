package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.dto.address.AddressRequest;
import com.dev.backend.dto.address.AddressResponse;
import com.dev.backend.entity.Address;
import com.dev.backend.exception.AppException;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.AddressMapper;
import com.dev.backend.repository.AddressRepository;
import com.dev.backend.service.AddressService;
import com.dev.backend.service.GHNService;
import com.dev.backend.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;
    private final GHNService ghnService;
    private final UserService userService;

    @Override
    public int countAddressByUser(Integer userId) {
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
        return toAddressResponse(address);
    }

    @Override
    public List<AddressResponse> getListAddressByUserId(Integer userId) {
        List<Address> addresses = addressRepository
                .findByUserId(userId);

        if (addresses == null || addresses.isEmpty()) {
            return List.of();
        }

        return addresses.stream()
                .map(this::toAddressResponse)
                .toList();
    }

    @Override
    @Transactional
    public AddressResponse savAddress(AddressRequest request, Integer userId) {
        if (countAddressByUser(userId) >= 6) {
            throw new AppException(422, "Bạn chỉ được lưu tối đa 6 địa chỉ");
        }

        if (request.isDefault()) {
            addressRepository.clearDefaultOnly(userId);
        }
        Address address = new Address();
        addressMapper.toEntityAddress(address, request);
        address.setUser(userService.getUserById(userId));
        if (countAddressByUser(userId) == 0) {
            address.setDefault(true);
        }
        addressRepository.save(address);
        return toAddressResponse(address);
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Integer addressId, AddressRequest request, Integer userId) {
        Address address = getAddressByIdAndUserId(addressId, userId);
        if (request.isDefault()) {
            addressRepository.clearDefaultOnly(userId);
        }
        addressMapper.toEntityAddress(address, request);
        addressRepository.save(address);
        return toAddressResponse(address);
    }

    @Override
    @Transactional
    public void defaultAddress(Integer addressId, Integer userId) {
        Address address = getAddressByIdAndUserId(addressId, userId);
        addressRepository.clearDefaultOnly(userId);
        address.setDefault(true);
        addressRepository.save(address);
    }

    @Override
    public AddressResponse toAddressResponse(Address address) {
        AddressResponse response = addressMapper.toDTO(address);
        response.setStreetFull(ghnService.getStreetFull(address.getProvinceId(), address.getDistrictId(),
                address.getWardCode(), address.getStreet()));
        return response;
    }

}
