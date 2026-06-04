package com.dev.backend.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;

import com.dev.backend.constant.ProductStatus;
import com.dev.backend.dto.image.ImageResponse;
import com.dev.backend.dto.product.ProductRequest;
import com.dev.backend.dto.product.ProductResponse;
import com.dev.backend.entity.Image;
import com.dev.backend.entity.Product;
import com.dev.backend.mapper.ProductMapper;
import com.dev.backend.repository.ProductRepository;
import com.dev.backend.service.ImageService;
import com.dev.backend.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ImageService imageService;

    @Override
    public List<ProductResponse> findAll() {

        return productRepository.findAll().stream().map(productMapper::toDTO).toList();

    }

    @Override
    public ProductResponse add(ProductRequest request) {

        Product product = new Product();
        product.setName(request.getName().strip());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setWeight(request.getWeight());
        product.setPublishYear(request.getPublishYear());
        product.setPages(request.getPages());
        product.setStatus(ProductStatus.valueOf(request.getStatus()));
        product.setDescription(request.getDescription());
        Product saved = save(product);
        log.debug("Saved product: {}", saved);
        List<ImageResponse> list = request.getCoverImages();
        for (ImageResponse item : list) {
            Image image = new Image();
            image.setUrlImage(item.url());
            image.setThumbnail(item.isThumbnail());
            image.setProduct(saved);
            imageService.save(image);
        }

        return productMapper.toDTO(saved);
    }

    @Override
    public void delete(Integer id) {
        // TODO Auto-generated method stub

    }

    @Override
    public Product findById(Integer id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Product findByName(String name) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Product save(Product product) {
        // TODO Auto-generated method stub
        return productRepository.save(product);
    }

    @Override
    public ProductResponse update(Integer id, ProductRequest productRequest) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void validate(ProductRequest productRequest) {
        // TODO Auto-generated method stub

    }

}
