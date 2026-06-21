package com.dev.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.constant.ProductBadge;
import com.dev.backend.constant.ProductStatus;
import com.dev.backend.constant.PromotionCampaignType;
import com.dev.backend.dto.product.ProductCardResponse;
import com.dev.backend.dto.product.ProductFilterRequest;
import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.entity.Product;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.ProductMapper;
import com.dev.backend.repository.ProductRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.ImageService;
import com.dev.backend.service.ProductAuthorService;
import com.dev.backend.service.ProductGenreService;
import com.dev.backend.service.ProductService;
import com.dev.backend.service.PublisherService;
import com.dev.backend.service.SeriesService;
import com.dev.backend.util.TextUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ImageService imageService;
    private final SeriesService seriesService;
    private final PublisherService publisherService;
    private final ProductGenreService productGenreService;
    private final ProductAuthorService productAuthorService;

    @Override
    public List<ProductResponse> findAll() {

        return productRepository.findAll().stream().map(productMapper::toDTO).toList();

    }

    @Override
    @Transactional
    public ProductResponse add(ProductRequest request) {

        Product product = new Product();
        product.setName(TextUtils.capitalizeFully(request.getName().strip()));
        product.setSlug(TextUtils.toSlug(request.getName().strip()));
        product.setOriginalPrice(request.getOriginalPrice());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setWeight(request.getWeight());
        product.setPublishYear(request.getPublishYear());
        product.setPages(request.getPages());
        product.setIsbn(request.getIsbn());
        product.setStatus(ProductStatus.valueOf(request.getStatus()));
        product.setDescription(request.getDescription());
        if (request.getSeriesId() != null) {
            product.setSeries(seriesService.findById(request.getSeriesId()));
        }
        product.setPublisher(publisherService.findById(request.getPublisherId()));

        Product saved = save(product);
        productGenreService.saveProductGenres(saved, request.getGenreIds());
        productAuthorService.saveProductAuthors(saved, request.getAuthorIds());
        imageService.saveProductImages(saved, request.getCoverImages());

        log.debug("Saved product: {}", saved);

        return productMapper.toDTO(saved);
    }

    @Override
    public ProductResponse edit(Integer id) {
        ProductResponse productResponse = productMapper.toDTO(findById(id));
        return productResponse;
    }

    @Override
    public void delete(Integer id) {
        // TODO Auto-generated method stub

    }

    @Override
    public Product findById(Integer id) {
        return productRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + id));
    }

    @Override
    public Product findByName(String name) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Product findBySlug(String slug) {
        return null;
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public ProductResponse update(Integer id, ProductRequest request) {
        Product product = findById(id);
        product.setName(TextUtils.capitalizeFully(request.getName().strip()));
        product.setSlug(TextUtils.toSlug(request.getName().strip()));
        product.setOriginalPrice(request.getOriginalPrice());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setWeight(request.getWeight());
        product.setPublishYear(request.getPublishYear());
        product.setPages(request.getPages());
        product.setIsbn(request.getIsbn());
        product.setStatus(ProductStatus.valueOf(request.getStatus()));
        product.setDescription(request.getDescription());
        if (request.getSeriesId() != null) {
            product.setSeries(seriesService.findById(request.getSeriesId()));
        }
        product.setPublisher(publisherService.findById(request.getPublisherId()));

        Product saved = save(product);
        productGenreService.saveProductGenres(saved, request.getGenreIds());
        productAuthorService.saveProductAuthors(saved, request.getAuthorIds());
        imageService.saveProductImages(saved, request.getCoverImages());

        log.debug("Saved product: {}", saved);

        return productMapper.toDTO(saved);
    }

    @Override
    public void validate(ProductRequest productRequest) {
        // TODO Auto-generated method stub

    }

    @Override
    public PageResponse<ProductResponse> pages(int page, int size, String keyword, String status) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id"));

        BaseStatus baseStatus = (status == null || status.isBlank())
                ? null
                : BaseStatus.valueOf(status);

        Page<Product> productPage = productRepository
                .findByNameContainingIgnoreCase(keyword == null ? "" : keyword, baseStatus, pageable);

        List<ProductResponse> items = productPage.getContent().stream().map(productMapper::toDTO).toList();

        return new PageResponse<>(
                items,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages());
    }

    @Override
    public PageResponse<ProductCardResponse> filterProducts(
            ProductFilterRequest request) {

        int page = request.getPage() != null
                ? request.getPage()
                : 0;

        int size = request.getSize() != null
                ? request.getSize()
                : 10;

        Sort sort = buildSort(request.getSort());

        Pageable pageable = PageRequest.of(
                page,
                size,
                sort);

        Page<ProductCardResponse> productPage = productRepository.filterProducts(
                request,
                pageable);

        productPage.getContent().forEach(product -> {
            product.setBadge(generateBadge(product));
        });

        return new PageResponse<>(
                productPage.getContent(),
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages());
    }

    private Sort buildSort(String sort) {

        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, "id");
        }

        return switch (sort) {
            case "priceAsc" ->
                Sort.by(Sort.Direction.ASC, "price");

            case "priceDesc" ->
                Sort.by(Sort.Direction.DESC, "price");

            case "soldCount" ->
                Sort.by(Sort.Direction.DESC, "soldCount");

            case "rating" ->
                Sort.by(Sort.Direction.DESC, "rating");

            case "newest" ->
                Sort.by(Sort.Direction.DESC, "id");

            default ->
                Sort.by(Sort.Direction.DESC, "id");
        };
    }

    public ProductBadge generateBadge(ProductCardResponse product) {

        if (product.getPromotion() != null
                && product.getPromotion().getType() == PromotionCampaignType.FLASH_SALE) {
            return ProductBadge.FLASH_SALE;
        }

        if (product.getSoldCount() != null
                && product.getSoldCount() >= 1000) {
            return ProductBadge.BEST_SELLER;
        }

        if (product.getCreatedAt() != null
                && product.getCreatedAt()
                        .isAfter(LocalDateTime.now().minusDays(30))) {
            return ProductBadge.NEW;
        }

        return null;
    }
}
