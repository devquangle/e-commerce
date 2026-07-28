package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.order.OrderFilterRequest;
import com.dev.backend.dto.order.OrderRequest;
import com.dev.backend.dto.order.OrderResponse;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.security.CustomUserDetails;
import com.dev.backend.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/my-order")
public class OrderUserController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ResponseData<OrderResponse>> createOrder(@RequestBody @Valid OrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        OrderResponse response = orderService.createOrder(request, userDetails.getId());
        return ResponseUtil.success("Tạo đơn thành công", response);
    }

    @GetMapping
    public ResponseEntity<ResponseData<PageResponse<OrderResponse>>> getMyOrder(
            @ModelAttribute OrderFilterRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PageResponse<OrderResponse> response = orderService.searchOrderUser(request, userDetails.getId());
        return ResponseUtil.success("Lấy danh sách đơn hàng thành công", response);
    }

}
