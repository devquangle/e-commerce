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

import com.dev.backend.bean.AddressBean;
import com.dev.backend.dto.AddressDTO;
import com.dev.backend.resp.ResponseData;
import com.dev.backend.resp.ResponseUtil;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.service.AddressService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @GetMapping("/auth/addresses")
    public ResponseEntity<ResponseData> getAddresses(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<AddressDTO> addresses = addressService.getListAddressByUserId(userDetails);
        return ResponseUtil.success("Lấy danh sách địa chỉ thành công", addresses);
    }

    @GetMapping("/auth/addresses/{addressId}")
    public ResponseEntity<ResponseData> getAddresses(@PathVariable Integer addressId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AddressDTO addresses = addressService.getAddressDTOByIdAndUserId(addressId, userDetails);

        return ResponseUtil.success("Lấy danh sách địa chỉ thành công", addresses);
    }

    @PostMapping("/auth/addresses")
    public ResponseEntity<ResponseData> addAddress(@RequestBody AddressBean addressBean,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AddressDTO addressDTO = addressService.savAddress(addressBean, userDetails);
        return ResponseUtil.success("Lưu địa chỉ thành công", addressDTO);
    }

    @PutMapping("/auth/addresses/{addressId}")
    public ResponseEntity<ResponseData> updateAddress(@PathVariable Integer addressId,
            @RequestBody AddressBean addressBean, @AuthenticationPrincipal CustomUserDetails userDetails) {
        AddressDTO addressDTO = addressService.updateAddress(addressId, addressBean, userDetails);
        return ResponseUtil.success("Cập nhật địa chỉ thành công", addressDTO);
    }

    @DeleteMapping("/auth/addresses/{addressId}")
    public ResponseEntity<ResponseData> deleteAddress(@PathVariable Integer addressId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        addressService.deleteAddress(addressId, userDetails);
        return ResponseUtil.success("Xóa địa chỉ thành công", null);
    }

}
