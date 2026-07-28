package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.order.OrderItemResponse;
import com.dev.backend.dto.order.OrderResponse;
import com.dev.backend.entity.Order;
import com.dev.backend.entity.OrderItem;

@Component
public class OrderMapper {

    public OrderResponse toDTO(Order order) {
        if (order == null) {
            return null;
        }
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setFullName(order.getFullName());
        response.setPhone(order.getPhone());
        response.setOrderCode(order.getOrderCode());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        return response;
    }

    public OrderItemResponse toOrderItemDTO(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }
        OrderItemResponse response = new OrderItemResponse();
        response.setOrderItemId(orderItem.getId());
        response.setQuantity(orderItem.getQuantity());
        response.setPrice(orderItem.getPrice());
        response.setOriginalPrice(orderItem.getOriginalPrice());
        response.setProductInfo(orderItem.getProductInfo());
        return response;
    }

}
