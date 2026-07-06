package com.dev.backend.service.impl;


import java.util.List;
import java.util.HashMap;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.beans.factory.annotation.Autowired;

import com.dev.backend.constant.ProductStatus;
import com.dev.backend.dto.product.ProductCardResponse;
import com.dev.backend.dto.product.ProductCartItemResponse;
import com.dev.backend.dto.product.ProductDetailResponse;
import com.dev.backend.dto.product.ProductFilterRequest;
import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.dto.productdetail.ProductInfo;
import com.dev.backend.entity.Product;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.exception.DuplicateFieldException;
import com.dev.backend.mapper.ProductMapper;
import com.dev.backend.mapper.PublisherMapper;
import com.dev.backend.mapper.SeriesMapper;
import com.dev.backend.repository.ProductRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.ImageService;
import com.dev.backend.service.OrderItemService;
import com.dev.backend.service.ProductAuthorService;
import com.dev.backend.service.ProductGenreService;
import com.dev.backend.service.ProductService;
import com.dev.backend.service.PromotionProductService;
import com.dev.backend.service.PublisherService;
import com.dev.backend.service.SeriesService;
import com.dev.backend.util.TextUtils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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
    private final OrderItemService orderItemService;
    private final PublisherService publisherService;
    private final ProductGenreService productGenreService;
    private final ProductAuthorService productAuthorService;

    @Lazy
    @Autowired
    private PromotionProductService promotionProductService;

    private final PublisherMapper publisherMapper;
    private final SeriesMapper seriesMapper;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {

        return productRepository.findAll().stream().map(productMapper::toDTO).toList();

    }

    @Override
    @Transactional
    public ProductResponse add(ProductRequest request) {
        validate(request);

        Product product = new Product();
        product.setName(TextUtils.capitalizeFully(request.getName().strip()));
        product.setSlug(TextUtils.toSlug(request.getName().strip()));
        product.setOriginalPrice(request.getOriginalPrice());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setWeight(request.getWeight());
        product.setPublishYear(request.getPublishYear());
        product.setPages(request.getPages());
        product.setLanguage(request.getLanguage());
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

        entityManager.flush();
        if (!entityManager.contains(saved)) {
            saved = entityManager.merge(saved);
        }
        entityManager.refresh(saved);

        log.debug("Saved product: {}", saved);

        return productMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDetailResponse edit(Integer id) {
        ProductDetailResponse dto = productMapper.toDetail(findById(id));
        return dto;
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Product product = findById(id);
        product.setStatus(ProductStatus.DELETED);
        save(product);
        log.info("Đã xóa mềm sản phẩm có ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Product findById(Integer id) {
        return productRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Product findByName(String name) {
        return productRepository.findByName(name).orElseThrow(
                () -> new NotFoundException("Không tìm thấy sản phẩm với tên: " + name));
    }

    @Override
    @Transactional(readOnly = true)
    public Product findBySlug(String slug) {
        return productRepository.findBySlug(slug).orElseThrow(
                () -> new NotFoundException("Không tìm thấy sản phẩm với slug: " + slug));
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public ProductResponse update(Integer id, ProductRequest request) {
        validate(request, id);
        Product product = findById(id);
        product.setName(TextUtils.capitalizeFully(request.getName().strip()));
        product.setSlug(TextUtils.toSlug(request.getName().strip()));
        product.setOriginalPrice(request.getOriginalPrice());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setWeight(request.getWeight());
        product.setPublishYear(request.getPublishYear());
        product.setPages(request.getPages());
        product.setLanguage(request.getLanguage());
        product.setIsbn(request.getIsbn());
        product.setStatus(ProductStatus.valueOf(request.getStatus()));
        product.setDescription(request.getDescription());
        if (request.getSeriesId() != null) {
            product.setSeries(seriesService.findById(request.getSeriesId()));
        } else {
            product.setSeries(null);
        }
        product.setPublisher(publisherService.findById(request.getPublisherId()));

        Product saved = save(product);
        productGenreService.saveProductGenres(saved, request.getGenreIds());
        productAuthorService.saveProductAuthors(saved, request.getAuthorIds());
        imageService.saveProductImages(saved, request.getCoverImages());

        entityManager.flush();
        if (!entityManager.contains(saved)) {
            saved = entityManager.merge(saved);
        }
        entityManager.refresh(saved);

        log.debug("Saved product: {}", saved);

        return productMapper.toDTO(saved);
    }

    @Override
    public void validate(ProductRequest productRequest) {
        validate(productRequest, null);
    }

    private void validate(ProductRequest request, Integer id) {
        DuplicateFieldException errors = new DuplicateFieldException(new HashMap<>());

        if (!errors.getErrors().isEmpty()) {
            throw errors;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> pages(int page, int size, String keyword, String status) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id"));

        ProductStatus baseStatus = (status == null || status.isBlank())
                ? null
                : ProductStatus.valueOf(status);

        Page<Product> productPage = productRepository
                .filterProducts(keyword == null ? "" : keyword, baseStatus, pageable);

        List<ProductResponse> items = productPage.getContent().stream().map(productMapper::toDTO).toList();

        return new PageResponse<>(
                items,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductCardResponse> filterProducts(
            ProductFilterRequest request) {
        int page = (request.getPage() == null || request.getPage() < 1)
                ? 0
                : request.getPage() - 1;

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

        // Removed setBadge loop as badge is no longer in ProductCardResponse

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

    @Override
    public ProductInfo productInfo(String slug) {
        Product product = findBySlug(slug);
        Integer productId = product.getId();
        ProductInfo productInfo = productMapper.mapProductInfo(product);
        productInfo.setDiscountValue(promotionProductService.findDiscountValueByProductId(productId));
        productInfo.setProductPublisher(publisherMapper.toProductPublisher(product.getPublisher()));
        productInfo.setProductSeries(seriesMapper.toProductSeries(product.getSeries()));
        productInfo.setProductAuthors(productAuthorService.findAuthorsByProductId(productId));
        productInfo.setProductGenres(productGenreService.findGenresByProductId(productId));
        productInfo.setCoverImages(imageService.findImagesByProductId(productId));
        productInfo.setSoldCount(orderItemService.getSoldCountByProductId(productId));
        return productInfo;
    }

    @Override
    public Product findWithDetailsById(Integer id) {
        return productRepository.findWithDetailsById(id).orElseThrow(
                () -> new NotFoundException("Không tìm thấy sản phẩm với slug: " + id));
        
    }

    @Override
    public ProductCartItemResponse productCartItemResponse(Integer productId) {
        Product product = findWithDetailsById(productId);
        ProductCartItemResponse dto = productMapper.mapProductCartItemResponse(product);
        dto.setDiscountValue(promotionProductService.findDiscountValueByProductId(productId));
        dto.setProductPublisher(publisherMapper.toProductPublisher(product.getPublisher()));
        dto.setProductSeries(seriesMapper.toProductSeries(product.getSeries()));
        dto.setProductAuthors(productAuthorService.findAuthorsByProductId(productId));
        dto.setProductGenres(productGenreService.findGenresByProductId(productId));
        dto.setUrlImage(imageService.getUrlImageIsThumbnailByProductId(productId));
        return dto;
    }
}
