package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.order.CancelOrderRequest;
import com.dev.backend.dto.order.OrderFilterRequest;
import com.dev.backend.dto.order.OrderResponseFull;
import com.dev.backend.response.PageResponse;
import com.dev.backend.response.ResponseData;
import com.dev.backend.response.ResponseUtil;
import com.dev.backend.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/admin/filter")
    public ResponseEntity<ResponseData<PageResponse<OrderResponseFull>>> getMyOrder(
            @ModelAttribute OrderFilterRequest request) {
        PageResponse<OrderResponseFull> response = orderService.searchOrder(request);
        return ResponseUtil.success("Lấy danh sách đơn hàng thành công", response);
    }

    @PostMapping("/admin/order/cancel")
    public ResponseEntity<ResponseData<Void>> postCancel(
            @RequestBody @Valid CancelOrderRequest request) {
        orderService.cancelOrder(null, request);
        return ResponseUtil.success("Huỷ đơn hàng thành công #" + request.getOrderCode(), null);
    }
    
}
