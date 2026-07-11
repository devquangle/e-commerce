package com.dev.backend.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.constant.VoucherStatus;
import com.dev.backend.dto.voucher.VoucherRepsonse;
import com.dev.backend.dto.voucher.VoucherRequest;
import com.dev.backend.entity.Voucher;
import com.dev.backend.mapper.VoucherMapper;
import com.dev.backend.repository.VoucherRepository;
import com.dev.backend.service.VoucherService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;

    @Override
    public VoucherRepsonse add(VoucherRequest request) {
        Voucher voucher = voucherMapper.add(request);
        return voucherMapper.toDTO(voucherRepository.save(voucher));
    }

    @Override
    public VoucherRepsonse update(Integer id, VoucherRequest request) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void insertData() {
        if (voucherRepository.count() > 0) {
            return;
        }

        List<Voucher> vouchers = new ArrayList<>();
        for (int i = 0; i <= 20; i++) {
            Voucher voucher = new Voucher();
            voucher.setName("Voucher " + i);
            voucher.setCode("VOUCHER" + String.format("%03d", i));
            voucher.setDiscountValue(5 + i);
            voucher.setMinOrderValue(100000);
            voucher.setMaxDiscountValue(50000);
            voucher.setUsageLimit(100);
            voucher.setUsedCount(0);
            voucher.setUsageLimitPerUser(1);
            voucher.setStartDate(LocalDate.now());
            voucher.setEndDate(LocalDate.now().plusMonths(1));
            voucher.setStatus(VoucherStatus.ACTIVE);
            vouchers.add(voucher);
        }
        voucherRepository.saveAll(vouchers);

    }

}