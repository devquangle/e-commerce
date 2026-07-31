package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.order.OrderItemResponse;

public interface OrderItemService {
    Long getSoldCountByProductId(Integer productId);

    List<OrderItemResponse> findByOrderCode(String orderCode);
}
