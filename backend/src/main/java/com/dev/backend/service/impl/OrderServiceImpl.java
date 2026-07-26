package com.dev.backend.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dev.backend.constant.OrderStatus;
import com.dev.backend.dto.order.OrderFilterRequest;
import com.dev.backend.dto.order.OrderResponse;
import com.dev.backend.entity.Order;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.OrderMapper;
import com.dev.backend.repository.OrderRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.GHNService;
import com.dev.backend.service.OrderService;
import com.dev.backend.util.FilterValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final GHNService ghnService;
    private final OrderMapper orderMapper;

    @Override
    public Order getOrderById(Integer id) {
        return orderRepository.findById(id).orElseThrow(() -> new NotFoundException("NOT FOUND ORDER ID" + id));
    }

    @Override
    public Long calculateTotal(Order order) {
        // Tổng thanh toán = Tổng tiền hàng - Giảm giá voucher + Phí vận chuyển
        long subtotal = order.getOrderItems().stream()
                .mapToLong(item -> (long) item.getPrice() * item.getQuantity())
                .sum();

        return Math.max(
                0L,
                subtotal
                        - (order.getVoucherAmount() == null ? 0L : order.getVoucherAmount())
                        + (order.getShippingFee() == null ? 0L : order.getShippingFee()));
    }

    @Override
    public OrderResponse toOrderResponse(Order order) {
        OrderResponse response = orderMapper.toDTO(order);
        response.setStreetFull(ghnService.getStreetFull(order.getProvinceId(), order.getDistrictId(),
                order.getWardCode(), order.getStreet()));
        response.setTotal(calculateTotal(order));
        return response;
    }

    @Override
    public PageResponse<OrderResponse> searchOrder(OrderFilterRequest request) {
       int page = (request.getPage() == null || request.getPage() < 1) ? 0 : request.getPage() - 1;
        int size = (request.getSize() == null || request.getSize() < 1) ? 10 : request.getSize();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        FilterValidator.validateDateRange(
                request.getStartDate(),
                request.getEndDate(),
                "Ngày bắt đầu",
                "Ngày kết thúc");
        OrderStatus status = OrderStatus.from(request.getStatus());
        String keyword = request.getKeyword();
        keyword = (keyword == null || keyword.isBlank())
                ? null
                : keyword.trim();
        Page<Order> pageResult = orderRepository.searchOrder(keyword, request.getStartDate(), request.getEndDate(), status, pageable);
        List<OrderResponse> items = pageResult.getContent().stream().map(this::toOrderResponse).toList();
        return new PageResponse<>(
                items,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages());
    }

    @Override
    public PageResponse<OrderResponse> searchOrderUser(OrderFilterRequest request, Integer userId) {
        int page = (request.getPage() == null || request.getPage() < 1) ? 0 : request.getPage() - 1;
        int size = (request.getSize() == null || request.getSize() < 1) ? 10 : request.getSize();

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        FilterValidator.validateDateRange(
                request.getStartDate(),
                request.getEndDate(),
                "Ngày bắt đầu",
                "Ngày kết thúc");
        OrderStatus status = OrderStatus.from(request.getStatus());
        String keyword = request.getKeyword();
        keyword = (keyword == null || keyword.isBlank())
                ? null
                : keyword.trim();
        Page<Order> pageResult = orderRepository.searchOrderUser(userId, keyword, request.getStartDate(),
                request.getEndDate(), status, pageable);
        List<OrderResponse> items = pageResult.getContent().stream().map(this::toOrderResponse).toList();
        return new PageResponse<>(
                items,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages());
    }
}
