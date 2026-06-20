package com.dev.backend.repository.impl;

import com.dev.backend.dto.product.ProductCardResponse;
import com.dev.backend.dto.product.ProductFilterRequest;
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
    public Page<ProductCardResponse> filterProducts(ProductFilterRequest request, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        // 1. Data Query
        CriteriaQuery<Tuple> query = cb.createTupleQuery();
        Root<Product> root = query.from(Product.class);

        // Joins
        Join<Product, OrderItem> oiJoin = root.join("orderItems", JoinType.LEFT);
        Join<Product, Review> rJoin = root.join("reviews", JoinType.LEFT);
        Join<Product, Image> imgJoin = root.join("images", JoinType.LEFT);
        imgJoin.on(cb.equal(imgJoin.get("isThumbnail"), true));

        Join<Product, PromotionProduct> ppJoin = root.join("promotionProducts", JoinType.LEFT);
        Join<PromotionProduct, Promotion> promoJoin = ppJoin.join("promotion", JoinType.LEFT);
        LocalDateTime now = LocalDateTime.now();
        promoJoin.on(
            cb.and(
                cb.lessThanOrEqualTo(promoJoin.get("startDate"), now),
                cb.greaterThanOrEqualTo(promoJoin.get("expireDate"), now)
            )
        );

        // Filter Predicates
        Predicate filterPredicate = ProductSpecification.buildPredicate(root, cb, request);
        query.where(filterPredicate);

        // Group By
        query.groupBy(
            root.get("id"),
            root.get("slug"),
            root.get("name"),
            root.get("price"),
            imgJoin.get("urlImage")
        );

        // Having (Rating Filter)
        Expression<Double> ratingExpr = cb.avg(rJoin.get("rate"));
        if (request.getRating() != null) {
            query.having(cb.greaterThanOrEqualTo(cb.coalesce(ratingExpr, 0.0), request.getRating()));
        }

        // Select (DTO Projection via Tuple to avoid strict type matching issues)
        query.select(cb.tuple(
            root.get("id").alias("id"),
            root.get("slug").alias("slug"),
            root.get("name").alias("name"),
            cb.sumAsLong(oiJoin.get("quantity")).alias("soldCount"),
            ratingExpr.alias("rating"),
            cb.countDistinct(rJoin.get("id")).alias("reviewCount"),
            root.get("price").alias("price"),
            imgJoin.get("urlImage").alias("urlImage"),
            cb.max(promoJoin.get("value")).alias("promotionValue")
        ));

        // Sorting
        if (pageable.getSort().isSorted()) {
            List<jakarta.persistence.criteria.Order> orders = pageable.getSort().stream().map(order -> {
                Path<?> path;
                switch (order.getProperty()) {
                    case "soldCount":
                    case "rating":
                    case "reviewCount":
                    case "promotionValue":
                        // Sorting by alias or expression can be tricky in some JPA providers.
                        // Ideally, we rebuild the expression for sorting.
                        if ("soldCount".equals(order.getProperty())) path = (Path<?>) (Expression<?>) cb.sumAsLong(oiJoin.get("quantity"));
                        else if ("rating".equals(order.getProperty())) path = (Path<?>) (Expression<?>) ratingExpr;
                        else if ("reviewCount".equals(order.getProperty())) path = (Path<?>) (Expression<?>) cb.countDistinct(rJoin.get("id"));
                        else if ("promotionValue".equals(order.getProperty())) path = (Path<?>) (Expression<?>) cb.max(promoJoin.get("value"));
                        else path = root.get(order.getProperty());
                        break;
                    default:
                        path = root.get(order.getProperty());
                        break;
                }
                return order.isAscending() ? cb.asc(path) : cb.desc(path);
            }).collect(Collectors.toList());
            query.orderBy(orders);
        }

        TypedQuery<Tuple> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Tuple> tuples = typedQuery.getResultList();

        List<ProductCardResponse> content = tuples.stream().map(tuple -> {
            ProductCardResponse res = new ProductCardResponse();
            res.setId(tuple.get("id", Integer.class));
            res.setSlug(tuple.get("slug", String.class));
            res.setName(tuple.get("name", String.class));
            
            Number soldCount = tuple.get("soldCount", Number.class);
            res.setSoldCount(soldCount != null ? soldCount.intValue() : 0);
            
            Number rating = tuple.get("rating", Number.class);
            res.setRating(rating != null ? rating.doubleValue() : 0.0);
            
            Number reviewCount = tuple.get("reviewCount", Number.class);
            res.setReviewCount(reviewCount != null ? reviewCount.intValue() : 0);
            
            res.setPrice(tuple.get("price", Integer.class));
            res.setBage(""); // Default empty string
            res.setUrlImage(tuple.get("urlImage", String.class));
            
            Number promoValue = tuple.get("promotionValue", Number.class);
            res.setPromotionValue(promoValue != null ? promoValue.intValue() : null);
            
            return res;
        }).collect(Collectors.toList());

        // 2. Count Query
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Product> countRoot = countQuery.from(Product.class);
        Predicate countFilterPredicate = ProductSpecification.buildPredicate(countRoot, cb, request);
        countQuery.where(countFilterPredicate);

        Long total;
        if (request.getRating() != null) {
            Join<Product, Review> countRJoin = countRoot.join("reviews", JoinType.LEFT);
            countQuery.select(cb.countDistinct(countRoot.get("id")));
            countQuery.having(cb.greaterThanOrEqualTo(cb.coalesce(cb.avg(countRJoin.get("rate")), 0.0), request.getRating()));
            countQuery.groupBy(countRoot.get("id"));
            List<Long> countResult = entityManager.createQuery(countQuery).getResultList();
            total = (long) countResult.size();
        } else {
            countQuery.select(cb.countDistinct(countRoot.get("id")));
            total = entityManager.createQuery(countQuery).getSingleResult();
        }

        return new PageImpl<>(content, pageable, total);
    }
}
