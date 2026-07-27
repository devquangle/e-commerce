package com.dev.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.address.AddressRequest;
import com.dev.backend.dto.address.AddressResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.service.AddressService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @GetMapping("/auth/addresses")
    public ResponseEntity<ResponseData<List<AddressResponse>>> getAddresses(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<AddressResponse> addresses = addressService.getListAddressByUserId(userDetails.getId());
        return ResponseUtil.success("Lấy danh sách địa chỉ thành công", addresses);
    }

    @GetMapping("/auth/addresses/{addressId}")
    public ResponseEntity<ResponseData<AddressResponse>> getAddresses(@PathVariable("addressId") Integer addressId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AddressResponse addresses = addressService.getAddressDTOByIdAndUserId(addressId, userDetails.getId());

        return ResponseUtil.success("Lấy địa chỉ thành công", addresses);
    }

    @GetMapping("/auth/addresses/count")
    public ResponseEntity<ResponseData<Integer>> getAddressCountByUser(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        int count = addressService.countAddressByUser(userDetails.getId());

        return ResponseUtil.success("Lấy số lượng địa chỉ thành công", count);
    }

    @PostMapping("/auth/addresses")
    public ResponseEntity<ResponseData<AddressResponse>> addAddress(
            @RequestBody com.dev.backend.dto.address.AddressRequest AddressRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AddressResponse addressDTO = addressService.savAddress(AddressRequest, userDetails.getId());
        return ResponseUtil.success("Thêm địa chỉ thành công", addressDTO);
    }

    @PutMapping("/auth/addresses/{addressId}")
    public ResponseEntity<ResponseData<AddressResponse>> updateAddress(@PathVariable("addressId") Integer addressId,
            @RequestBody AddressRequest AddressRequest, @AuthenticationPrincipal CustomUserDetails userDetails) {
        AddressResponse addressDTO = addressService.updateAddress(addressId, AddressRequest, userDetails.getId());
        return ResponseUtil.success("Cập nhật địa chỉ thành công", addressDTO);
    }

    @DeleteMapping("/auth/addresses/{addressId}")
    public ResponseEntity<ResponseData<Object>> deleteAddress(@PathVariable("addressId") Integer addressId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        addressService.deleteAddress(addressId, userDetails.getId());
        return ResponseUtil.success("Xóa địa chỉ thành công", null);
    }

    @PutMapping("/auth/addresses/{addressId}/default")
    public ResponseEntity<ResponseData<Object>> defaultAddress(@PathVariable("addressId") Integer addressId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        addressService.defaultAddress(addressId, userDetails.getId());
        return ResponseUtil.success("Cập nhật địa chỉ thành công", null);
    }

}
