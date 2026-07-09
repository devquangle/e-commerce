package com.dev.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.cart.CartCountResponse;
import com.dev.backend.dto.cart.CartItemQuantity;
import com.dev.backend.dto.cart.CartItemRequest;
import com.dev.backend.dto.cart.CartItemResponse;
import com.dev.backend.dto.cart.CartResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.service.CartItemService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartItemService cartItemService;

    @GetMapping
    public ResponseEntity<ResponseData<List<CartResponse>>> getCart(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<CartResponse> items = cartItemService.getCartByUserId(userDetails.getId());
        return ResponseUtil.success("Lấy danh sách sản phẩm trong giỏ hàng thành công", items);
    }

    @PostMapping
    public ResponseEntity<ResponseData<CartItemResponse>> addToCart(@RequestBody CartItemRequest cartItemRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        CartItemResponse data = cartItemService.addToCart(cartItemRequest, userDetails.getId());
        return ResponseUtil.success("Lấy danh sách sản phẩm trong giỏ hàng thành công", data);
    }

    @PutMapping
    public ResponseEntity<ResponseData<CartItemResponse>> updaQuantity(@PathVariable("cartItemId") Integer cartItemId,
            @RequestBody CartItemQuantity cartItemQuantity, @RequestBody CartItemRequest cartItemRequest,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        CartItemResponse data = cartItemService.updateQuantity(cartItemId, cartItemQuantity.getQuantity(),
                userDetails.getId());
        return ResponseUtil.success("Lấy danh sách sản phẩm trong giỏ hàng thành công", data);
    }

    @GetMapping("/count")
    public ResponseEntity<ResponseData<CartCountResponse>> getCartCount(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        CartCountResponse count = cartItemService.getCountCartByUserId(userDetails.getId());
        return ResponseUtil.success("Lấy số lượng sản phẩm trong giỏ hàng thành công", count);
    }

}
