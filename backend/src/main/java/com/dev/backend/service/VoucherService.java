package com.dev.backend.service;

import com.dev.backend.dto.voucher.VoucherFilterRequest;
import com.dev.backend.dto.voucher.VoucherRepsonse;
import com.dev.backend.dto.voucher.VoucherRequest;
import com.dev.backend.response.PageResponse;

public interface VoucherService {
    VoucherRepsonse add(VoucherRequest request);

    VoucherRepsonse update(Integer id, VoucherRequest request);

    PageResponse<VoucherRepsonse> search(VoucherFilterRequest request);

    void insertData();
}
