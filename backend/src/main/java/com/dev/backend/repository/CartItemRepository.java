package com.dev.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.backend.dto.cart.CartCountResponse;
import com.dev.backend.entity.CartItem;

import jakarta.transaction.Transactional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

  // Đếm số dòng trong cart
  @Query("""
          SELECT COUNT(c)
          FROM CartItem c
          WHERE c.user.id = :userId
      """)
  CartCountResponse countCartByUserId(@Param("userId") Integer userId);

  // Lấy danh sách cart của user
  @Query("""
          SELECT c
          FROM CartItem c
          WHERE c.user.id = :userId
      """)
  List<CartItem> findCartByUserId(@Param("userId") Integer userId);

  // Lấy CartItem theo user và product
  @Query("""
          SELECT c
          FROM CartItem c
          WHERE c.user.id = :userId
            AND c.product.id = :productId
      """)
  Optional<CartItem> findByUserIdAndProductId(
      @Param("userId") Integer userId,
      @Param("productId") Integer productId);

  @Query("""
          SELECT c
          FROM CartItem c
          WHERE c.id = :cartItemId
            AND c.user.id = :userId
      """)
  Optional<CartItem> findByIdAndUserId(
      @Param("cartItemId") Integer cartItemId,
      @Param("userId") Integer userId);

  // Kiểm tra tồn tại
  @Query("""
          SELECT COUNT(c) > 0
          FROM CartItem c
          WHERE c.user.id = :userId
            AND c.product.id = :productId
      """)
  boolean existsCartItem(
      @Param("userId") Integer userId,
      @Param("productId") Integer productId);

  @Transactional
  @Modifying
  @Query("""
       DELETE
       FROM CartItem c
       WHERE c.user.id = :userId
         AND c.id IN :cartItemIds
      """)
  void deleteCartItemsByIds(
      @Param("userId") Integer userId,
      @Param("cartItemIds") List<Integer> cartItemIds);

  // Xóa toàn bộ cart
  @Transactional
  @Modifying
  @Query("""
          DELETE
          FROM CartItem c
          WHERE c.user.id = :userId
      """)
  void deleteCartByUserId(@Param("userId") Integer userId);
}