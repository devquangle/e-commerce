package com.dev.backend.dto.cart;

import com.dev.backend.dto.product.ProductCartItemResponse;
import com.dev.backend.dto.productdetail.ProductInfo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CartResponse {
    private Integer cartItemId;
    private Integer quantity;
    private ProductCartItemResponse productCartItemResponse;
}
