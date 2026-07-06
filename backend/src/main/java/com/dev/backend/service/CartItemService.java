package com.dev.backend.service;

import java.util.List;

import com.dev.backend.dto.cart.CartCountResponse;
import com.dev.backend.dto.cart.CartResponse;
import com.dev.backend.security.CustomUserDetails;

public interface CartItemService {
    List<CartResponse> getCartByUserId(CustomUserDetails userDetails);

    CartCountResponse getCountCartByUserId(CustomUserDetails userDetails);

}