package com.dev.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.constant.ProductBadge;
import com.dev.backend.constant.ProductStatus;
import com.dev.backend.constant.PromotionCampaignType;
import com.dev.backend.dto.product.ProductCardResponse;
import com.dev.backend.dto.product.ProductDetailResponse;
import com.dev.backend.dto.product.ProductFilterRequest;
import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.entity.Product;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.exception.DuplicateFieldException;
import com.dev.backend.mapper.ProductMapper;
import com.dev.backend.repository.ProductRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.ImageService;
import com.dev.backend.service.ProductAuthorService;
import com.dev.backend.service.ProductGenreService;
import com.dev.backend.service.ProductService;
import com.dev.backend.service.PublisherService;
import com.dev.backend.service.SeriesService;
import com.dev.backend.service.AuthorService;
import com.dev.backend.service.GenreService;
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
    private final PublisherService publisherService;
    private final ProductGenreService productGenreService;
    private final ProductAuthorService productAuthorService;
    private final AuthorService authorService;
    private final GenreService genreService;

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

        if (request.getName() == null || request.getName().isBlank()) {
            errors.addError("name", "Tên sản phẩm không được để trống");
        } else {
            String slug = TextUtils.toSlug(request.getName().strip());
            Optional<Product> existingProduct = productRepository.findBySlug(slug);
            if (existingProduct.isPresent() && (id == null || !existingProduct.get().getId().equals(id))) {
                errors.addError("name", "Sản phẩm với tên này (hoặc đường dẫn slug) đã tồn tại");
            }
        }

        if (request.getOriginalPrice() == null) {
            errors.addError("originalPrice", "Giá gốc không được để trống");
        } else if (request.getOriginalPrice() < 0) {
            errors.addError("originalPrice", "Giá gốc không được âm");
        }

        if (request.getPrice() == null) {
            errors.addError("price", "Giá bán không được để trống");
        } else if (request.getPrice() < 0) {
            errors.addError("price", "Giá bán không được âm");
        }

        if (request.getQuantity() == null) {
            errors.addError("quantity", "Số lượng không được để trống");
        } else if (request.getQuantity() < 0) {
            errors.addError("quantity", "Số lượng không được âm");
        }

        if (request.getWeight() == null) {
            errors.addError("weight", "Trọng lượng không được để trống");
        } else if (request.getWeight() < 0) {
            errors.addError("weight", "Trọng lượng không được âm");
        }

        if (request.getPages() != null && request.getPages() <= 0) {
            errors.addError("pages", "Số trang phải lớn hơn 0");
        }

        if (request.getStatus() == null || request.getStatus().isBlank()) {
            errors.addError("status", "Trạng thái không được để trống");
        } else {
            try {
                ProductStatus.valueOf(request.getStatus());
            } catch (IllegalArgumentException e) {
                errors.addError("status", "Trạng thái không hợp lệ");
            }
        }

        if (request.getPublisherId() == null) {
            errors.addError("publisherId", "Nhà xuất bản không được để trống");
        } else {
            try {
                publisherService.findById(request.getPublisherId());
            } catch (NotFoundException e) {
                errors.addError("publisherId", "Nhà xuất bản không tồn tại");
            }
        }

        if (request.getSeriesId() != null) {
            try {
                seriesService.findById(request.getSeriesId());
            } catch (NotFoundException e) {
                errors.addError("seriesId", "Bộ series sách không tồn tại");
            }
        }

        if (request.getGenreIds() == null || request.getGenreIds().isEmpty()) {
            errors.addError("genreIds", "Danh mục thể loại không được để trống");
        } else {
            for (Integer genreId : request.getGenreIds()) {
                try {
                    genreService.findById(genreId);
                } catch (NotFoundException e) {
                    errors.addError("genreIds", "Thể loại với ID " + genreId + " không tồn tại");
                    break;
                }
            }
        }

        if (request.getAuthorIds() == null || request.getAuthorIds().isEmpty()) {
            errors.addError("authorIds", "Danh sách tác giả không được để trống");
        } else {
            for (Integer authorId : request.getAuthorIds()) {
                try {
                    authorService.findById(authorId);
                } catch (NotFoundException e) {
                    errors.addError("authorIds", "Tác giả với ID " + authorId + " không tồn tại");
                    break;
                }
            }
        }

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
