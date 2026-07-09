package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dev.backend.dto.cart.CartCountResponse;
import com.dev.backend.dto.cart.CartItemRequest;
import com.dev.backend.dto.cart.CartItemResponse;
import com.dev.backend.dto.cart.CartResponse;
import com.dev.backend.dto.cart.DeleteCartItemsRequest;
import com.dev.backend.entity.CartItem;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.CartMapper;
import com.dev.backend.repository.CartItemRepository;
import com.dev.backend.repository.UserRepository;
import com.dev.backend.service.CartItemService;
import com.dev.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class CartItemServiceImpl implements CartItemService {
    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    private final ProductService productService;

    private final CartMapper cartMapper;

    @Override
    public List<CartResponse> getCartByUserId(Integer userId) {

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
    public CartCountResponse getCountCartByUserId(Integer userId) {
        return cartItemRepository.countCartByUserId(userId);
    }

    @Override
    public CartItem findByUserIdAndProductId(Integer userId, Integer productId) {
        return cartItemRepository.findByUserIdAndProductId(userId, productId).orElse(null);
    }

    @Override
    public CartItem findByIdAndUserId(Integer cartItemId, Integer userId) {
        return cartItemRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new NotFoundException("NOT FOUND CART ITEM BY ID " + cartItemId));
    }

    @Override
    public CartItemResponse addToCart(CartItemRequest cartItemRequest, Integer userId) {
        CartItem cartItem = findByUserIdAndProductId(userId, cartItemRequest.getProductId());
        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + cartItemRequest.getQuantity());
        } else {
            cartItem = new CartItem();
            cartItem.setQuantity(cartItemRequest.getQuantity());
            cartItem.setProduct(productService.findById(cartItemRequest.getProductId()));
            cartItem.setUser(userRepository.getReferenceById(userId));
        }
        return cartMapper.toCartItemDTO(cartItemRepository.save(cartItem));
    }

    @Override
    public CartItemResponse updateQuantity(Integer cartItemId, Integer quantity, Integer userId) {
        CartItem cartItem = findByIdAndUserId(cartItemId, userId);
        cartItem.setQuantity(quantity);
        return cartMapper.toCartItemDTO(cartItemRepository.save(cartItem));
    }

    @Override
    public void deleteCartItem(Integer cartItemId, Integer userId) {
       CartItem cartItem= findByIdAndUserId(cartItemId, userId);
       cartItemRepository.delete(cartItem);
    }

    @Override
    public void deleteCartItems(DeleteCartItemsRequest cartItemsRequest, Integer userId) {
        cartItemRepository.deleteCartItemsByIds(userId, cartItemsRequest.getCartItemIds());       
    }

}
