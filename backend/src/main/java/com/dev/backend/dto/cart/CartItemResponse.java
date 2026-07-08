package com.dev.backend.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CartItemResponse {
    private Integer cartItemId;
    private Integer productId;
    private Integer quantity;
    private boolean checked;
}
