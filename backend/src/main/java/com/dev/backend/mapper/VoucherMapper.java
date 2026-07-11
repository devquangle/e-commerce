package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.voucher.VoucherRepsonse;
import com.dev.backend.dto.voucher.VoucherRequest;
import com.dev.backend.entity.Voucher;
@Component
public class VoucherMapper {
    public VoucherRepsonse toDTO(Voucher voucher) {
        if (voucher == null) {
            return null;

        }
        VoucherRepsonse dto = new VoucherRepsonse();
        dto.setId(voucher.getId());
        dto.setCode(voucher.getCode());
        dto.setName(voucher.getName());

        dto.setDiscountValue(voucher.getDiscountValue());
        dto.setMinOrderValue(voucher.getMinOrderValue());
        dto.setMaxDiscountValue(voucher.getMaxDiscountValue());

        dto.setUsageLimit(voucher.getUsageLimit());
        dto.setUsedCount(voucher.getUsedCount());

        dto.setStartDate(voucher.getStartDate());
        dto.setEndDate(voucher.getEndDate());

        dto.setStatus(voucher.getStatus());
        return dto;
    }

    public Voucher add(VoucherRequest request) {
        Voucher voucher = new Voucher();
        voucher.setName(request.getName());
        voucher.setCode(request.getCode());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setMinOrderValue(request.getMinOrderValue());
        voucher.setMaxDiscountValue(request.getMaxDiscountValue());
        voucher.setUsageLimitPerUser(request.getUsageLimitPerUser());
        voucher.setUsedCount(0);
        voucher.setUsageLimit(request.getUsageLimit());
        voucher.setStartDate(request.getStartDate());
        voucher.setEndDate(request.getEndDate());
        voucher.setStatus(request.getStatus());
        return voucher;

    }

}
