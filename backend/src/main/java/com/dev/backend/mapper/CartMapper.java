package com.dev.backend.mapper;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.cart.CartResponse;
import com.dev.backend.entity.CartItem;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CartMapper {

    public CartResponse toDTO(CartItem cartItem) {
        if (cartItem == null) {
            return null;
        }
        CartResponse response = new CartResponse();
        response.setCartItemId(cartItem.getId());
        response.setQuantity(cartItem.getQuantity());
        return response;
    }
}
