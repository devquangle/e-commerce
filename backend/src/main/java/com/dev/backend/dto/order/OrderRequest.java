package com.dev.backend.dto.order;

import com.dev.backend.constant.PaymentMethod;


public class OrderRequest {
    private String fullName;
    private String phone;
    private Integer provinceId;
    private Integer districtId;
    private String wardCode;
    private String street;
    
    private PaymentMethod paymentMethod;
    private Integer shippingFee;
}
