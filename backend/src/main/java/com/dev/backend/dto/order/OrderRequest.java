package com.dev.backend.dto.order;

import java.util.List;

import com.dev.backend.constant.PaymentMethod;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
    private Integer addressId;
    private List<Integer> cartItemIds;
    private Integer voucherId;
    private PaymentMethod paymentMethod;
    private String note;
}
