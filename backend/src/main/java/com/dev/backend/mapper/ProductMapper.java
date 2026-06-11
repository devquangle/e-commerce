package com.dev.backend.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.dev.backend.dto.product.ProductAuthorResponse;
import com.dev.backend.dto.product.ProductGenreResponse;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.entity.Image;
import com.dev.backend.entity.Product;
import com.dev.backend.entity.ProductAuthor;
import com.dev.backend.entity.ProductGenre;

@Component
public class ProductMapper {

    public ProductResponse toDTO(Product product) {
        if (product == null) {
            return null;
        }
        
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setIsbn(product.getIsbn());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setWeight(product.getWeight());
        
        // Tránh NullPointerException nếu publishYear bị null
        dto.setPublishYear(product.getPublishYear() != null ? product.getPublishYear().toString() : null);
        dto.setPages(product.getPages());
        
        // Map thông tin Publisher và Series (Kiểm tra null an toàn)
        dto.setPublisherName(product.getPublisher() != null ? product.getPublisher().getName() : "");
        dto.setSeriesName(product.getSeries() != null ? product.getSeries().getName() : "");
        
        // Map các danh sách liên quan thay vì để null
        dto.setProductAuthors(productAuthorResponse(product.getProductAuthors()));
        dto.setProductGenres(productGenreResponse(product.getProductGenres()));
        
        dto.setUrlImageDefault(urlImageDefault(product.getImages()));
        
        return dto;
    }

    private List<ProductAuthorResponse> productAuthorResponse(List<ProductAuthor> productAuthors) {
        if (productAuthors == null || productAuthors.isEmpty()) {
            return new ArrayList<>();
        }

        return productAuthors.stream().map(pa -> {
            ProductAuthorResponse res = new ProductAuthorResponse();
            if (pa.getAuthor() != null) {
                res.setId(pa.getAuthor().getId());
                res.setName(pa.getAuthor().getName());
            }
            return res;
        }).collect(Collectors.toList());
    }

    private List<ProductGenreResponse> productGenreResponse(List<ProductGenre> productGenres) {
        if (productGenres == null || productGenres.isEmpty()) {
            return new ArrayList<>();
        }
        
        return productGenres.stream().map(pg -> {
            ProductGenreResponse res = new ProductGenreResponse();
            if (pg.getGenre() != null) {
                res.setId(pg.getGenre().getId());
                res.setName(pg.getGenre().getName());
            }
            return res;
        }).collect(Collectors.toList());
    }

    private String urlImageDefault(List<Image> images) {
        if (images == null || images.isEmpty()) {
            return "";
        }
    
        return images.stream()
                .filter(img -> img != null && img.isThumbnail())
                .map(img -> img.getUrlImage())
                .findFirst()
                .orElseGet(() -> images.get(0) != null ? images.get(0).getUrlImage() : "");

    }
}