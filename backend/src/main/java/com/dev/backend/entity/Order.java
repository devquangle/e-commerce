package com.dev.backend.entity;

import java.util.ArrayList;
import java.util.List;

import com.dev.backend.constant.OrderStatus;
import com.dev.backend.constant.PaymentMethod;
import com.dev.backend.constant.PaymentStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order extends BaseAuditableEntity<Integer> {

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, length = 10)
    private String phone;

    @Column(nullable = false)
    private Integer provinceId;

    @Column(nullable = false)
    private Integer districtId;

    @Column(nullable = false)
    private String wardCode;

    @Column(nullable = false)
    private String street;

    private String noted;
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    private String cancel;

    @Column(nullable = false, unique = true, updatable = false)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id")
    private Voucher voucher; // Cho phép null nếu đơn hàng không dùng voucher

    @Column(name = "voucher_amount")
    private Integer voucherAmount;

    private Integer shippingFee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

  
}
