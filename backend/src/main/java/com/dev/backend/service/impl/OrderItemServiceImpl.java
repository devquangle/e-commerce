package com.dev.backend.service.impl;

import org.springframework.stereotype.Service;

import com.dev.backend.repository.OrderItemRepository;
import com.dev.backend.service.OrderItemService;
import com.dev.backend.constant.OrderStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class OrderItemServiceImpl implements OrderItemService {
    private final OrderItemRepository orderItemRepository;

    @Override
    public Long getSoldCountByProductId(Integer productId) {
        return orderItemRepository.getSoldCountByProductId(productId, OrderStatus.COMPLETED);
    }
}
