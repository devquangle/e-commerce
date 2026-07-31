package com.dev.backend.service;

import com.dev.backend.constant.OrderStatus;
import com.dev.backend.dto.order.CancelOrderRequest;
import com.dev.backend.dto.order.ChangeAddressOrderRequest;
import com.dev.backend.dto.order.OrderDetailResponse;
import com.dev.backend.dto.order.OrderFilterRequest;
import com.dev.backend.dto.order.OrderRequest;
import com.dev.backend.dto.order.OrderResponse;

import com.dev.backend.entity.Order;
import com.dev.backend.response.PageResponse;

public interface OrderService {


    Order getOrderById(Integer id);

    boolean existsByOrderCode(String orderCode);

    Order getOrderByOrderCode(String orderCode);

    Order getOrderByOrderCodeAndUserId(String orderCode, Integer userId);

    OrderDetailResponse getOrderDetailResponse(String orderCode);


    PageResponse<OrderResponse> searchOrderUser(OrderFilterRequest request, Integer userId);

    PageResponse<OrderResponse> searchOrder(OrderFilterRequest request);

    OrderResponse createOrder(OrderRequest request, Integer userId);

    void changeAddressByOrderCode(Integer userId, ChangeAddressOrderRequest request);

    void validateStatusTransition(
            OrderStatus currentStatus,
            OrderStatus newStatus);

    void cancelOrder(Integer userId, CancelOrderRequest request);
}
