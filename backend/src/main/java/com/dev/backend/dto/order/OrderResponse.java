package com.dev.backend.dto.order;

import java.time.LocalDate;
import com.dev.backend.constant.OrderStatus;
import com.dev.backend.constant.PaymentMethod;
import com.dev.backend.constant.PaymentStatus;

import jakarta.persistence.Column;
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

    private Integer provinceId;
    private Integer districtId;
    private String wardCode;
    private String street;
    
    private String streetFull;

    private Long total;
    private String orderCode;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus status;
    private LocalDate createdAt;
}
