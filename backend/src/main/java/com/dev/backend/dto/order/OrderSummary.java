package com.dev.backend.dto.order;

import java.util.List;

import com.dev.backend.entity.OrderItem;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderSummary {

    private List<OrderItem> orderItems;

    private Integer subtotal;

    private Integer totalWeight;
}