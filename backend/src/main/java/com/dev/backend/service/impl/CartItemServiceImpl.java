package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.dto.cart.CartCountResponse;
import com.dev.backend.dto.cart.CartItemRequest;
import com.dev.backend.dto.cart.CartItemResponse;
import com.dev.backend.dto.cart.CartResponse;
import com.dev.backend.entity.CartItem;
import com.dev.backend.mapper.CartMapper;
import com.dev.backend.repository.CartItemRepository;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.service.CartItemService;
import com.dev.backend.service.ProductService;
import com.dev.backend.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class CartItemServiceImpl implements CartItemService {
    private final CartItemRepository cartItemRepository;

    private final UserService userService;

    private final ProductService productService;

    private final CartMapper cartMapper;

    @Override
    public List<CartResponse> getCartByUserId(CustomUserDetails userDetails) {
        Integer userId = userDetails.getUser().getId();

        return cartItemRepository.findCartByUserId(userId)
                .stream()
                .map(cartItem -> {
                    CartResponse response = cartMapper.toDTO(cartItem);
                    response.setProduct(
                            productService.productCartItemResponse(cartItem.getProduct().getId()));
                    return response;
                })
                .toList();
    }

    @Override
    public CartCountResponse getCountCartByUserId(CustomUserDetails userDetails) {
        Integer userId = userService.userIsLogin(userDetails).getId();
        return cartItemRepository.countCartByUserId(userId);
    }

    @Override
    public CartItem findCartItem(Integer userId, Integer productId) {
        return cartItemRepository.findCartItem(userId, productId).orElse(null);
    }

    @Override
    public void saveCartItem(CartItemRequest cartItemRequest, CustomUserDetails userDetails) {
        Integer userId = userDetails.getUser().getId();
        CartItem cartItem = findCartItem(userId, cartItemRequest.getProductId());
        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + cartItemRequest.getQuantity());
        } else {
            cartItem = new CartItem();
            cartItem.setQuantity(cartItemRequest.getQuantity());
            cartItem.setProduct(productService.findById(cartItemRequest.getProductId()));
            cartItem.setUser(userDetails.getUser());
        }
        cartItemRepository.save(cartItem);

    }
}
