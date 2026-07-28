package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.order.OrderItemResponse;
import com.dev.backend.entity.OrderItem;

public interface OrderItemService {
    Long getSoldCountByProductId(Integer productId);

    List<OrderItemResponse> findByOrderCode(String orderCode);
}
