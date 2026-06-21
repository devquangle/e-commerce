package com.dev.backend.repository.impl;

import com.dev.backend.constant.PromotionCampaignType;
import com.dev.backend.dto.product.ProductCardResponse;
import com.dev.backend.dto.product.ProductFilterRequest;
import com.dev.backend.dto.product.PromotionResponse;
import com.dev.backend.entity.*;
import com.dev.backend.repository.ProductRepositoryCustom;
import com.dev.backend.repository.specification.ProductSpecification;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class ProductRepositoryImpl implements ProductRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

   @Override
public Page<ProductCardResponse> filterProducts(
        ProductFilterRequest request,
        Pageable pageable) {

    CriteriaBuilder cb = entityManager.getCriteriaBuilder();

    // =========================
    // DATA QUERY
    // =========================
    CriteriaQuery<Tuple> query = cb.createTupleQuery();
    Root<Product> root = query.from(Product.class);
    query.distinct(true);

    // JOINS
    Join<Product, OrderItem> oiJoin =
            root.join("orderItems", JoinType.LEFT);

    Join<Product, Review> rJoin =
            root.join("reviews", JoinType.LEFT);

    Join<Product, Image> imgJoin =
            root.join("images", JoinType.LEFT);

    Join<Product, PromotionProduct> ppJoin =
            root.join("promotionProducts", JoinType.LEFT);

    Join<PromotionProduct, Promotion> promoJoin =
            ppJoin.join("promotion", JoinType.LEFT);

    LocalDateTime now = LocalDateTime.now();

    promoJoin.on(
            cb.and(
                    cb.lessThanOrEqualTo(promoJoin.get("startDate"), now),
                    cb.greaterThanOrEqualTo(promoJoin.get("expireDate"), now)
            )
    );

    // FILTER
    Predicate filterPredicate =
            ProductSpecification.buildPredicate(root, cb, request);

    query.where(filterPredicate);

    // =========================
    // EXPRESSIONS
    // =========================
    Expression<Double> ratingExpr = cb.avg(rJoin.get("rate"));

    Expression<Long> soldCountExpr =
            cb.sumAsLong(oiJoin.get("quantity"));

    Expression<Long> reviewCountExpr =
            cb.countDistinct(rJoin.get("id"));

    Expression<Integer> promotionValueExpr =
            cb.max(promoJoin.get("value"));

    // ⭐ FIX IMAGE ONLY (KHÔNG ĐỘNG ORDER)
    Expression<String> thumbnailImage =
            cb.greatest(
                    cb.<String>selectCase()
                            .when(
                                    cb.equal(imgJoin.get("isThumbnail"), true),
                                    imgJoin.get("urlImage")
                            )
                            .otherwise((String) null)
            );

    // =========================
    // GROUP BY (FIX ONLY)
    // =========================
    query.groupBy(
            root.get("id"),
            root.get("slug"),
            root.get("name"),
            root.get("price"),
            root.get("createdAt"),
            promoJoin.get("promotionType")
    );

    // HAVING
    if (request.getRating() != null) {
        query.having(
                cb.greaterThanOrEqualTo(
                        cb.coalesce(ratingExpr, 0.0),
                        request.getRating()
                )
        );
    }

    // =========================
    // SELECT
    // =========================
    query.select(cb.tuple(
            root.get("id").alias("id"),
            root.get("slug").alias("slug"),
            root.get("name").alias("name"),
            root.get("createdAt").alias("createdAt"),

            soldCountExpr.alias("soldCount"),
            ratingExpr.alias("rating"),
            reviewCountExpr.alias("reviewCount"),

            root.get("price").alias("price"),

            thumbnailImage.alias("urlImage"),

            promotionValueExpr.alias("promotionValue"),
            promoJoin.get("promotionType").alias("promotionType")
    ));

    // =========================
    // EXECUTE
    // =========================
    TypedQuery<Tuple> typedQuery =
            entityManager.createQuery(query);

    typedQuery.setFirstResult((int) pageable.getOffset());
    typedQuery.setMaxResults(pageable.getPageSize());

    List<Tuple> tuples = typedQuery.getResultList();

    List<ProductCardResponse> content =
            tuples.stream().map(tuple -> {

                ProductCardResponse res =
                        new ProductCardResponse();

                res.setId(tuple.get("id", Integer.class));
                res.setSlug(tuple.get("slug", String.class));
                res.setName(tuple.get("name", String.class));

                Number sold = tuple.get("soldCount", Number.class);
                res.setSoldCount(sold != null ? sold.intValue() : 0);

                Number rating = tuple.get("rating", Number.class);
                res.setRating(rating != null ? rating.doubleValue() : 0.0);

                Number review = tuple.get("reviewCount", Number.class);
                res.setReviewCount(review != null ? review.intValue() : 0);

                res.setPrice(tuple.get("price", Integer.class));

                res.setCreatedAt(tuple.get("createdAt", LocalDateTime.class));

                Number promoValue = tuple.get("promotionValue", Number.class);
                PromotionCampaignType promoType =
                        tuple.get("promotionType", PromotionCampaignType.class);

                if (promoValue != null || promoType != null) {
                    PromotionResponse promotion = new PromotionResponse();
                    promotion.setValue(promoValue != null ? promoValue.intValue() : null);
                    promotion.setType(promoType);
                    res.setPromotion(promotion);
                }

                // IMAGE FIX
                res.setUrlImage(tuple.get("urlImage", String.class));

                return res;
            }).toList();

    // =========================
    // COUNT QUERY (KHÔNG ĐỘNG)
    // =========================
    CriteriaQuery<Long> countQuery =
            cb.createQuery(Long.class);

    Root<Product> countRoot =
            countQuery.from(Product.class);

    Predicate countPredicate =
            ProductSpecification.buildPredicate(countRoot, cb, request);

    countQuery.where(countPredicate);

    Long total =
            entityManager.createQuery(
                    countQuery.select(cb.countDistinct(countRoot.get("id")))
            ).getSingleResult();

    return new PageImpl<>(content, pageable, total);
}

}
