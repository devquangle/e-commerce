package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.repository.OrderItemRepository;
import com.dev.backend.service.OrderItemService;
import com.dev.backend.constant.OrderStatus;
import com.dev.backend.dto.order.OrderItemResponse;
import com.dev.backend.mapper.OrderMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class OrderItemServiceImpl implements OrderItemService {
    private final OrderItemRepository orderItemRepository;
    private final OrderMapper orderMapper;

    @Override
    public Long getSoldCountByProductId(Integer productId) {
        return orderItemRepository.getSoldCountByProductId(productId, OrderStatus.COMPLETED);
    }

    @Override
    public List<OrderItemResponse> findByOrderCode(String orderCode) {
        return orderItemRepository.findByOrderCode(orderCode).stream().map(orderMapper::toOrderItemDTO).toList();
    }
}
