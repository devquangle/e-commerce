package com.dev.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.order.CancelOrderRequest;
import com.dev.backend.dto.order.ChangeAddressOrderRequest;
import com.dev.backend.dto.order.OrderDetailResponse;
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
@RequestMapping("/api/v1")
public class OrderUserController {

    private final OrderService orderService;

    @PostMapping("/my-order")
    public ResponseEntity<ResponseData<OrderResponse>> createOrder(@RequestBody @Valid OrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        OrderResponse response = orderService.createOrder(request, userDetails.getId());
        return ResponseUtil.success("Tạo đơn thành công", response);
    }

    @GetMapping("/my-order")
    public ResponseEntity<ResponseData<PageResponse<OrderResponse>>> getMyOrder(
            @ModelAttribute OrderFilterRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        PageResponse<OrderResponse> response = orderService.searchOrderUser(request, userDetails.getId());
        return ResponseUtil.success("Lấy danh sách đơn hàng thành công", response);
    }

    @GetMapping("/order")
    public ResponseEntity<ResponseData<OrderDetailResponse>> getOrderDetail(
            @RequestParam("orderCode") String orderCode) {
        OrderDetailResponse response = orderService.getOrderDetailResponse(orderCode);
        return ResponseUtil.success("Lấy đơn hàng thành công", response);
    }

    @PostMapping("/order/change-address")
    public ResponseEntity<ResponseData<Void>> postChangeAddress(
            @RequestBody @Valid ChangeAddressOrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        orderService.changeAddressByOrderCode(userDetails.getId(), request);
        return ResponseUtil.success("Đổi địa chỉ đơn hàng thành công #" + request.getOrderCode(), null);
    }

    @PostMapping("/order/cancel")
    public ResponseEntity<ResponseData<Void>> postCancel(
            @RequestBody @Valid CancelOrderRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        orderService.cancelOrder(userDetails.getId(), request);
        return ResponseUtil.success("Huỷ đơn hàng thành công #" + request.getOrderCode(), null);
    }

}
