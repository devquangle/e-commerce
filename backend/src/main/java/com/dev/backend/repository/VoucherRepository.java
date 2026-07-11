package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.entity.Voucher;

public interface VoucherRepository extends JpaRepository<Voucher,Integer> {
    
}
