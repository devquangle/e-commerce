package com.dev.backend.dto.order;

import java.time.LocalDate;

import com.dev.backend.constant.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderResponse {
    private Integer id;
    private String fullName;
    private String phone;
    private String streetFull;
    private LocalDate createdAt;
    private Long total;
    private String paymentMethod;
    private String paymentStatus;
    private OrderStatus status;
}
