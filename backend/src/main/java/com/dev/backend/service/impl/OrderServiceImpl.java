package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dev.backend.constant.OrderStatus;
import com.dev.backend.constant.PaymentStatus;
import com.dev.backend.dto.ghn.CalculateFeeRequest;
import com.dev.backend.dto.order.OrderDetailResponse;
import com.dev.backend.dto.order.OrderFilterRequest;
import com.dev.backend.dto.order.OrderRequest;
import com.dev.backend.dto.order.OrderResponse;
import com.dev.backend.dto.order.OrderSummary;
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
import com.dev.backend.service.OrderItemService;
import com.dev.backend.service.OrderService;
import com.dev.backend.service.ProductService;
import com.dev.backend.service.PromotionProductService;
import com.dev.backend.service.UserService;
import com.dev.backend.service.VoucherService;
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
        private final VoucherService voucherService;
        private final ProductService productService;
        private final OrderItemService orderItemService;

        @Override
        public Order getOrderById(Integer id) {
                return orderRepository.findById(id).orElseThrow(() -> new NotFoundException("NOT FOUND ORDER ID" + id));
        }

        @Override
        public boolean existsByOrderCode(String orderCode) {
                return orderRepository.existsByOrderCode(orderCode);
        }

        @Override
        public Order getOrderByOrderCode(String orderCode) {
                return orderRepository.getOrderByOrderCode(orderCode)
                                .orElseThrow(() -> new NotFoundException("NOT FOUND ORDER orderCode" + orderCode));
        };

        @Override
        public OrderDetailResponse getOrderDetailResponse(String orderCode) {
                OrderDetailResponse response = new OrderDetailResponse();
                response.setOrderInfo(this.toOrderResponse(getOrderByOrderCode(orderCode)));
                response.setItems(orderItemService.findByOrderCode(orderCode));
                return response;
        }

        @Override
        @Transactional
        public OrderResponse createOrder(OrderRequest request, Integer userId) {

                User user = userService.getUserById(userId);

                Address address = addressService.getAddressByIdAndUserId(
                                request.getAddressId(),
                                userId);

                List<CartItem> cartItems = getValidCartItems(
                                request.getCartItemIds(),
                                userId);

                promotionProductService.reservePromotions(cartItems);
                Order order = buildOrder(request, user, address);

                OrderSummary summary = buildOrderItems(order, cartItems);

                applyVoucher(
                                order,
                                request.getVoucherId(),
                                userId,
                                summary.getSubtotal());

                applyShippingFee(
                                order,
                                address,
                                summary.getTotalWeight());

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

        private List<CartItem> getValidCartItems(
                        List<Integer> cartItemIds,
                        Integer userId) {

                List<CartItem> cartItems = cartItemService.findByIdInAndUserId(cartItemIds, userId);

                if (cartItems.isEmpty()) {
                        throw new BadRequestException("Giỏ hàng trống");
                }

                if (cartItems.size() != cartItemIds.size()) {
                        throw new BadRequestException("Danh sách sản phẩm không hợp lệ");
                }

                return cartItems;
        }

        private Order buildOrder(
                        OrderRequest request,
                        User user,
                        Address address) {

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

                order.setPaymentStatus(PaymentStatus.UNPAID);

                order.setStatus(OrderStatus.PENDING);
                order.setOrderCode(generateOrderCode());
                return order;
        }

        private String generateOrderCode() {

                String orderCode;

                do {
                        orderCode = "ODR-" +
                                        UUID.randomUUID()
                                                        .toString()
                                                        .replace("-", "")
                                                        .substring(0, 8)
                                                        .toUpperCase();

                } while (orderRepository.existsByOrderCode(orderCode));

                return orderCode;
        }

        private OrderSummary buildOrderItems(
                        Order order,
                        List<CartItem> cartItems) {

                List<OrderItem> orderItems = new ArrayList<>();

                int subtotal = 0;
                int totalWeight = 0;

                for (CartItem cartItem : cartItems) {

                        Product product = cartItem.getProduct();

                        OrderItem orderItem = new OrderItem();

                        orderItem.setOrder(order);

                        orderItem.setProduct(product);

                        orderItem.setQuantity(cartItem.getQuantity());

                        int originalPrice = product.getPrice();

                        int price = promotionProductService.calculateSalePrice(product);

                        orderItem.setOriginalPrice(originalPrice);

                        orderItem.setPrice(price);

                        orderItem.setProductInfo(
                                        productService.productSnapshot(product.getId()));

                        subtotal += price * cartItem.getQuantity();

                        totalWeight += product.getWeight() * cartItem.getQuantity();

                        orderItems.add(orderItem);
                }

                order.setOrderItems(orderItems);

                return new OrderSummary(
                                orderItems,
                                subtotal,
                                totalWeight);
        }

        private void applyVoucher(
                        Order order,
                        Integer voucherId,
                        Integer userId,
                        Integer subtotal) {

                if (voucherId == null) {
                        return;
                }

                Voucher voucher = voucherService.validateVoucher(
                                voucherId,
                                userId,
                                subtotal);

                Integer voucherAmount = voucherService.calculateDiscount(
                                voucher,
                                subtotal);

                order.setVoucher(voucher);

                order.setVoucherAmount(voucherAmount);
        }

        private void applyShippingFee(
                        Order order,
                        Address address,
                        Integer totalWeight) {

                CalculateFeeRequest request = new CalculateFeeRequest();

                request.setToDistrictId(address.getDistrictId());

                request.setToWardCode(address.getWardCode());

                request.setWeight(totalWeight);

                Integer shippingFee = ghnService.calculateFee(request);

                order.setShippingFee(shippingFee);
        }

}
