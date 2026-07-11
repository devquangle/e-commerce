package com.dev.backend.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dev.backend.constant.VoucherStatus;
import com.dev.backend.dto.voucher.VoucherFilterRequest;
import com.dev.backend.dto.voucher.VoucherRepsonse;
import com.dev.backend.dto.voucher.VoucherRequest;
import com.dev.backend.entity.Voucher;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.VoucherMapper;
import com.dev.backend.repository.VoucherRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.VoucherService;
import com.dev.backend.util.FilterValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;

    @Override
    public Voucher findById(Integer id) {
        return voucherRepository.findById(id).orElseThrow(() -> new NotFoundException("NOT FOUND VOUCHER ID" + id));
    }

    @Override
    public VoucherRepsonse edit(Integer id) {
        return voucherMapper.toDTO(findById(id));
    }

    @Override
    public VoucherRepsonse add(VoucherRequest request) {
        Voucher voucher = voucherMapper.add(request);
        return voucherMapper.toDTO(voucherRepository.save(voucher));
    }

    @Override
    public VoucherRepsonse update(Integer id, VoucherRequest request) {
        Voucher voucher = voucherMapper.update(findById(id), request);
        return voucherMapper.toDTO(voucherRepository.save(voucher));
    }

    @Override
    public void delete(Integer id) {
        Voucher voucher = findById(id);
        voucher.setStatus(VoucherStatus.DELETED);
        voucherRepository.save(voucher);
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

    @Override
    public PageResponse<VoucherRepsonse> search(VoucherFilterRequest request) {
        int page = (request.getPage() == null || request.getPage() < 1) ? 0 : request.getPage() - 1;
        int size = (request.getSize() == null || request.getSize() < 1) ? 10 : request.getSize();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        FilterValidator.validateDateRange(
                request.getStartDate(),
                request.getEndDate(),
                "Ngày bắt đầu",
                "Ngày kết thúc");

        VoucherStatus status = VoucherStatus.from(request.getStatus());
        String keyword = request.getKeyword();
        keyword = (keyword == null || keyword.isBlank())
                ? null
                : keyword.trim();
        Page<Voucher> pageResult = voucherRepository.search(keyword, request.getStartDate(), request.getEndDate(),
                status, pageable);
        List<VoucherRepsonse> items = pageResult.getContent().stream().map(voucherMapper::toDTO).toList();
        return new PageResponse<>(
                items,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages());
    }

}