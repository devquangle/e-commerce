package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.voucher.VoucherFilterRequest;
import com.dev.backend.dto.voucher.VoucherRepsonse;
import com.dev.backend.dto.voucher.VoucherRequest;
import com.dev.backend.dto.voucher.VoucherUserRepsonse;
import com.dev.backend.entity.Voucher;
import com.dev.backend.response.PageResponse;

public interface VoucherService {

    Voucher findById(Integer id);

    VoucherRepsonse add(VoucherRequest request);

    VoucherRepsonse edit(Integer id);

    VoucherRepsonse update(Integer id, VoucherRequest request);

    void delete(Integer id);

    PageResponse<VoucherRepsonse> search(VoucherFilterRequest request);

    List<VoucherUserRepsonse> getAvailableVouchersForUser(Integer userId,String code);

    void insertData();
}
