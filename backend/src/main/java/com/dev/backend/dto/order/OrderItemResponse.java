package com.dev.backend.dto.order;

import com.dev.backend.dto.productsnapshot.ProductSnapshot;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemResponse {
    private Integer orderItemId;
    private Integer quantity;
    private Integer price;
    private Integer originalPrice;
    private ProductSnapshot productInfo;
}
