package com.dev.backend.service;

import com.dev.backend.dto.voucher.VoucherRepsonse;
import com.dev.backend.dto.voucher.VoucherRequest;

public interface VoucherService {
    VoucherRepsonse add(VoucherRequest request);

    VoucherRepsonse update(Integer id, VoucherRequest request);

    void insertData();
}
