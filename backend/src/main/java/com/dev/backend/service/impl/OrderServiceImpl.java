package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.math3.analysis.function.Add;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dev.backend.constant.OrderStatus;
import com.dev.backend.constant.PaymentMethod;
import com.dev.backend.constant.PaymentStatus;
import com.dev.backend.dto.order.OrderFilterRequest;
import com.dev.backend.dto.order.OrderRequest;
import com.dev.backend.dto.order.OrderResponse;
import com.dev.backend.entity.Address;
import com.dev.backend.entity.CartItem;
import com.dev.backend.entity.Order;
import com.dev.backend.entity.OrderItem;
import com.dev.backend.entity.Product;
import com.dev.backend.entity.User;
import com.dev.backend.entity.Voucher;
import com.dev.backend.exception.BadRequestException;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.OrderMapper;
import com.dev.backend.repository.OrderRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.AddressService;
import com.dev.backend.service.CartItemService;
import com.dev.backend.service.GHNService;
import com.dev.backend.service.OrderService;
import com.dev.backend.service.PromotionProductService;
import com.dev.backend.service.UserService;
import com.dev.backend.util.FilterValidator;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class OrderServiceImpl implements OrderService {

        private final OrderRepository orderRepository;
        private final GHNService ghnService;
        private final OrderMapper orderMapper;
        private final AddressService addressService;
        private final UserService userService;
        private final CartItemService cartItemService;
        private final PromotionProductService promotionProductService;

        @Override
        public Order getOrderById(Integer id) {
                return orderRepository.findById(id).orElseThrow(() -> new NotFoundException("NOT FOUND ORDER ID" + id));
        }

        @Override
        @Transactional
        public OrderResponse createOrder(OrderRequest request, Integer userId) {

                User user = userService.getUserById(userId);

                Address address = addressService.getAddressByIdAndUserId(
                                request.getAddressId(), userId);

                List<CartItem> cartItems = cartItemService.findByIdInAndUserId(
                                request.getCartItemIds(), userId);

                if (cartItems.isEmpty()) {
                        throw new BadRequestException("Giỏ hàng trống");
                }

                if (cartItems.size() != request.getCartItemIds().size()) {
                        throw new BadRequestException("Danh sách sản phẩm không hợp lệ");
                }

                Order order = new Order();

                order.setUser(user);

                order.setFullName(address.getFullName());
                order.setPhone(address.getPhone());
                order.setProvinceId(address.getProvinceId());
                order.setDistrictId(address.getDistrictId());
                order.setWardCode(address.getWardCode());
                order.setStreet(address.getStreet());

                order.setNoted(request.getNote());

                order.setPaymentMethod(request.getPaymentMethod());

                if (request.getPaymentMethod() == PaymentMethod.COD) {
                        order.setPaymentStatus(PaymentStatus.UNPAID);
                } else {
                        order.setPaymentStatus(PaymentStatus.UNPAID);
                }

                order.setStatus(OrderStatus.PENDING);

                int subtotal = 0;

                List<OrderItem> orderItems = new ArrayList<>();

                for (CartItem cartItem : cartItems) {

                        Product product = cartItem.getProduct();

                        OrderItem orderItem = new OrderItem();

                        orderItem.setOrder(order);
                        orderItem.setProduct(product);
                        orderItem.setQuantity(cartItem.getQuantity());

                        int originalPrice = product.getPrice();

                        int discountPercent = promotionProductService.getDiscountValueByProductId(product.getId());

                        int price = originalPrice - (originalPrice * discountPercent / 100);

                        orderItem.setOriginalPrice(originalPrice);
                        orderItem.setPrice(price);

                        // orderItem.setProductInfo(productMapper.toSnapshot(product));

                        subtotal += price * cartItem.getQuantity();

                        orderItems.add(orderItem);
                }

                order.setOrderItems(orderItems);

                // Voucher
                int voucherAmount = 0;

                if (request.getVoucherId() != null) {

                        Voucher voucher = voucherService.validateVoucher(
                                        request.getVoucherId(),
                                        userId,
                                        subtotal);

                        voucherAmount = voucherService.calculateDiscount(voucher, subtotal);

                        order.setVoucher(voucher);

                        order.setVoucherAmount(voucherAmount);
                }

                // Shipping
                int shippingFee = shippingService.calculateShippingFee(
                                address,
                                cartItems);

                order.setShippingFee(shippingFee);

                Order savedOrder = orderRepository.save(order);

                cartItemService.deleteAll(cartItems);

                return toOrderResponse(savedOrder);
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
                Page<Order> pageResult = orderRepository.searchOrder(keyword, request.getStartDate(),
                                request.getEndDate(), status, pageable);
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
