package com.dev.backend.repository.impl;

import com.dev.backend.constant.PromotionCampaignType;
import com.dev.backend.dto.product.ProductCardResponse;
import com.dev.backend.dto.product.ProductFilterRequest;
import com.dev.backend.dto.product.PromotionResponse;
import com.dev.backend.entity.*;
import com.dev.backend.entity.Order;
import com.dev.backend.repository.ProductRepositoryCustom;
import com.dev.backend.repository.specification.ProductSpecification;
import jakarta.persistence.*;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
        // MAIN QUERY
        // =========================
        CriteriaQuery<Tuple> query = cb.createTupleQuery();
        Root<Product> root = query.from(Product.class);
        query.distinct(true);

        // JOIN (NO IMAGE JOIN -> AVOID DUPLICATE ROWS)
        Join<Product, OrderItem> oiJoin = root.join("orderItems", JoinType.LEFT);
        Join<Product, Review> rJoin = root.join("reviews", JoinType.LEFT);

        Join<Product, PromotionProduct> ppJoin = root.join("promotionProducts", JoinType.LEFT);
        Join<PromotionProduct, Promotion> promoJoin = ppJoin.join("promotion", JoinType.LEFT);

        LocalDateTime now = LocalDateTime.now();

        promoJoin.on(
                cb.and(
                        cb.lessThanOrEqualTo(promoJoin.get("startDate"), now),
                        cb.greaterThanOrEqualTo(promoJoin.get("expireDate"), now)
                )
        );

        // =========================
        // FILTER
        // =========================
        Predicate predicate = ProductSpecification.buildPredicate(root, cb, request);
        query.where(predicate);

        // =========================
        // EXPRESSIONS
        // =========================
        Expression<Double> ratingExpr = cb.avg(rJoin.get("rate"));
        Expression<Long> soldExpr = cb.sumAsLong(oiJoin.get("quantity"));
        Expression<Long> reviewExpr = cb.countDistinct(rJoin.get("id"));
        Expression<Integer> promoValueExpr = cb.max(promoJoin.get("value"));

        // =========================
        // SUBQUERY FOR IMAGE (FIX NULL + NO DUPLICATE)
        // =========================
        Subquery<String> imgSub = query.subquery(String.class);
        Root<Image> imgRoot = imgSub.from(Image.class);

        imgSub.select(imgRoot.get("urlImage"));
        imgSub.where(
                cb.equal(imgRoot.get("product"), root),
                cb.isTrue(imgRoot.get("isThumbnail"))
        );

        // =========================
        // GROUP BY
        // =========================
        query.groupBy(
                root.get("id"),
                root.get("slug"),
                root.get("name"),
                root.get("price"),
                root.get("createdAt"),
                promoJoin.get("promotionType")
        );

        // =========================
        // HAVING (rating filter)
        // =========================
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

                soldExpr.alias("soldCount"),
                ratingExpr.alias("rating"),
                reviewExpr.alias("reviewCount"),

                root.get("price").alias("price"),
                imgSub.alias("urlImage"),

                promoValueExpr.alias("promotionValue"),
                promoJoin.get("promotionType").alias("promotionType")
        ));

        // =========================
        // SORT (SAFE)
        // =========================
        List<Order> orders = new ArrayList<>();

        if (pageable.getSort().isSorted()) {
            for (Sort.Order sortOrder : pageable.getSort()) {

                Expression<?> expression;

                switch (sortOrder.getProperty()) {

                    case "soldCount" -> expression = soldExpr;
                    case "rating" -> expression = ratingExpr;
                    case "reviewCount" -> expression = reviewExpr;
                    case "promotionValue" -> expression = promoValueExpr;

                    case "price" -> expression = root.get("price");
                    case "createdAt" -> expression = root.get("createdAt");
                    case "name" -> expression = root.get("name");

                    default -> expression = root.get("id");
                }

                orders.add(sortOrder.isAscending()
                        ? cb.asc(expression)
                        : cb.desc(expression));
            }
        }

        query.orderBy(orders);

        // =========================
        // EXECUTE
        // =========================
        TypedQuery<Tuple> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<ProductCardResponse> content = typedQuery.getResultList()
                .stream()
                .map(tuple -> {

                    ProductCardResponse res = new ProductCardResponse();

                    res.setId(tuple.get("id", Integer.class));
                    res.setSlug(tuple.get("slug", String.class));
                    res.setName(tuple.get("name", String.class));
                    res.setCreatedAt(tuple.get("createdAt", LocalDateTime.class));

                    Number sold = tuple.get("soldCount", Number.class);
                    res.setSoldCount(sold != null ? sold.intValue() : 0);

                    Number rating = tuple.get("rating", Number.class);
                    res.setRating(rating != null ? rating.doubleValue() : 0.0);

                    Number review = tuple.get("reviewCount", Number.class);
                    res.setReviewCount(review != null ? review.intValue() : 0);

                    res.setPrice(tuple.get("price", Integer.class));
                    res.setUrlImage(tuple.get("urlImage", String.class));

                    Number promoValue = tuple.get("promotionValue", Number.class);
                    PromotionCampaignType promoType =
                            tuple.get("promotionType", PromotionCampaignType.class);

                    if (promoValue != null || promoType != null) {
                        PromotionResponse promo = new PromotionResponse();
                        promo.setValue(promoValue != null ? promoValue.intValue() : null);
                        promo.setType(promoType);
                        res.setPromotion(promo);
                    }

                    return res;
                })
                .toList();

        // =========================
        // COUNT QUERY (SAFE)
        // =========================
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Product> countRoot = countQuery.from(Product.class);

        Predicate countPredicate =
                ProductSpecification.buildPredicate(countRoot, cb, request);

        countQuery.select(cb.countDistinct(countRoot.get("id")));
        countQuery.where(countPredicate);

        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }
}