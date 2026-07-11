package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.voucher.VoucherFilterRequest;
import com.dev.backend.dto.voucher.VoucherRepsonse;
import com.dev.backend.dto.voucher.VoucherRequest;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.VoucherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping("/search")
    public ResponseEntity<ResponseData<PageResponse<VoucherRepsonse>>> filter(
            @ModelAttribute VoucherFilterRequest request) {
        PageResponse<VoucherRepsonse> response = voucherService.search(request);
        return ResponseUtil.success("Lấy danh sách voucher thành công", response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<VoucherRepsonse>> edit(
            @PathVariable("id") Integer id) {
        VoucherRepsonse response = voucherService.edit(id);
        return ResponseUtil.success("Lấy voucher thành công", response);
    }

    @PostMapping
    public ResponseEntity<ResponseData<VoucherRepsonse>> add(
           @RequestBody VoucherRequest request) {
        VoucherRepsonse response = voucherService.add(request);
        return ResponseUtil.success("Tạo voucher thành công", response);
    }

}
