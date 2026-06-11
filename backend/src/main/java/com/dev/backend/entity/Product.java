package com.dev.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.dev.backend.constant.ProductStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Integer quantity;
    private Integer originalPrice;
    private Integer price;

    @Column(columnDefinition = "TEXT")
    private String description;
    private Integer weight;

    private String isbn;
    private String slug;

    private LocalDate publishYear;
    private Integer pages;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProductStatus status = ProductStatus.ACTIVE;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product")
    private List<Image> images;

    @OneToMany(mappedBy = "product")
    private List<Favorite> favorites;

    @OneToMany(mappedBy = "product")
    private List<CartItem> cartItems;

    @OneToMany(mappedBy = "product")
    private List<PromotionProduct> promotionProducts;
    @OneToMany(mappedBy = "product")
    private List<ProductGenre> productGenres;
    @OneToMany(mappedBy = "product")
    private List<ProductAuthor> productAuthors;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_id")
    private Series series;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;
}
