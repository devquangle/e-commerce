package com.dev.backend.dto.order;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class OrderDetailResponse {

    private OrderResponse orderInfo;

    private List<OrderItemResponse> items;
}