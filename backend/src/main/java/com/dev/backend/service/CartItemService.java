package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.cart.CartCountResponse;
import com.dev.backend.dto.cart.CartItemRequest;
import com.dev.backend.dto.cart.CartItemResponse;
import com.dev.backend.dto.cart.CartResponse;
import com.dev.backend.entity.CartItem;

public interface CartItemService {
    List<CartResponse> getCartByUserId(Integer userId);

    CartCountResponse getCountCartByUserId(Integer userId);

    CartItem findByUserIdAndProductId(Integer userId, Integer productId);

    CartItem findByIdAndUserId(Integer cartItemId, Integer userId);

    CartItemResponse addToCart(CartItemRequest cartItemRequest, Integer userId);

    CartItemResponse updateQuantity(Integer cartItemId, Integer quantity, Integer userId);
}