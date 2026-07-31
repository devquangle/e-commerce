package com.dev.backend.dto.order;

import java.time.LocalDate;

import com.dev.backend.constant.OrderStatus;
import com.dev.backend.constant.PaymentMethod;
import com.dev.backend.constant.PaymentStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderResponseFull {
    private Integer id;
    private String fullName;
    private String phone;

    private Integer provinceId;
    private Integer districtId;
    private String wardCode;
    private String street;

    private String streetFull;

    private String noted;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus status;
    private String cancel;
    private String orderCode;

    private Long successOrders;
    private Long finishedOrders;
    private Double successRate;

    private Integer voucherAmount;
    private Integer shippingFee;

    private Integer total;

    private LocalDate createdAt;
}
