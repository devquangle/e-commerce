package com.dev.backend.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.constant.PromotionCampaignType;
import com.dev.backend.dto.promotion.PromotionDetailResponse;
import com.dev.backend.dto.promotion.PromotionFilter;
import com.dev.backend.dto.promotion.PromotionRequest;
import com.dev.backend.dto.promotion.PromotionResponse;
import com.dev.backend.entity.Promotion;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.mapper.PromotionMapper;
import com.dev.backend.repository.PromotionRepository;
import com.dev.backend.repository.ProductRepository;
import com.dev.backend.entity.Product;
import com.dev.backend.entity.PromotionProduct;
import com.dev.backend.dto.promotion.PromotionProductRequest;
import com.dev.backend.exception.BadRequestException;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.PromotionProductService;
import com.dev.backend.service.PromotionService;
import com.dev.backend.util.FilterValidator;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

        private final PromotionRepository promotionRepository;
        private final PromotionMapper promotionMapper;
        private final PromotionProductService promotionProductService;
        private final ProductRepository productRepository;

        private Promotion setPromotionRequest(Promotion promotion, PromotionRequest request) {
                promotion.setName(request.getName());
                promotion.setStartDate(request.getStartDate());
                promotion.setExpireDate(request.getEndDate());
                promotion.setStatus(BaseStatus.from(request.getStatus()));
                promotion.setPromotionCampaignType(PromotionCampaignType.from(request.getPromotionCampaignType()));
                return promotion;
        }

        @Override
        @Transactional
        public PromotionResponse addPromotion(PromotionRequest promotionRequest) {
                validateOverlap(null, promotionRequest);
                Promotion promotion = new Promotion();
                setPromotionRequest(promotion, promotionRequest);
                promotion.setCreatedAt(LocalDate.now());
                Promotion saved = savePromotion(promotion);
                promotionProductService.addPromotionProducts(saved, promotionRequest.getPromotionProducts());
                return promotionMapper.toDTO(saved);
        }

        @Override
        @Transactional
        public PromotionResponse updatePromotion(Integer id, PromotionRequest promotionRequest) {
                validateOverlap(id, promotionRequest);
                Promotion promotion = findByIdWithPromotionProducts(id);
                setPromotionRequest(promotion, promotionRequest);
                Promotion saved = savePromotion(promotion);
                promotionProductService.updatePromotionProducts(saved, promotionRequest.getPromotionProducts());
                return promotionMapper.toDTO(saved);
        }

        private void validateOverlap(Integer promotionId, PromotionRequest request) {
                LocalDate reqStart = request.getStartDate();
                LocalDate reqEnd = request.getEndDate();

                if (request.getPromotionProducts() == null || request.getPromotionProducts().isEmpty()) {
                        return;
                }

                for (PromotionProductRequest ppReq : request.getPromotionProducts()) {
                        Integer productId = ppReq.getId();
                        Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + productId));

                        if (product.getPromotionProducts() != null) {
                                for (PromotionProduct pp : product.getPromotionProducts()) {
                                        Promotion otherPromo = pp.getPromotion();
                                        if (otherPromo == null || otherPromo.getStatus() == BaseStatus.DELETED) {
                                                continue;
                                        }

                                        // Bỏ qua chính nó khi cập nhật
                                        if (promotionId != null && otherPromo.getId().equals(promotionId)) {
                                                continue;
                                        }

                                        LocalDate otherStart = otherPromo.getStartDate();
                                        LocalDate otherEnd = otherPromo.getExpireDate();

                                        // Kiểm tra trùng lặp: !(reqEnd.isBefore(otherStart) || reqStart.isAfter(otherEnd))
                                        if (!(reqEnd.isBefore(otherStart) || reqStart.isAfter(otherEnd))) {
                                                throw new BadRequestException(
                                                        String.format("Sản phẩm '%s' đang tham gia chương trình '%s' (%s đến %s). Thời gian chương trình mới không được trùng lặp!",
                                                                product.getName(),
                                                                otherPromo.getName(),
                                                                otherStart.toString(),
                                                                otherEnd.toString()
                                                        )
                                                );
                                        }
                                }
                        }
                }
        }

        @Override
        public Promotion findByIdWithPromotionProducts(Integer id) {
                return promotionRepository.findByIdWithPromotionProducts(id)
                                .orElseThrow(() -> new NotFoundException("Không tìm thấy chương trình khuyến mãi"));
        }

        @Override
        public Promotion findById(Integer id) {
                return promotionRepository.findById(id)
                                .orElseThrow(() -> new NotFoundException("Không tìm thấy chương trình khuyến mãi"));
        }

        @Override
        public PromotionDetailResponse edit(Integer id) {
                return promotionMapper.toDetailDTO(findByIdWithPromotionProducts(id));
        }

        @Override
        public void delete(Integer id) {
                Promotion promotion = findById(id);
                promotion.setStatus(BaseStatus.DELETED);
                savePromotion(promotion);
        }

        @Override
        public Promotion savePromotion(Promotion promotion) {
                return promotionRepository.save(promotion);
        }

        @Override
        public void validate(PromotionRequest promotionRequest) {
                // TODO Auto-generated method stub

        }

        @Override
        public PageResponse<PromotionResponse> search(PromotionFilter filter) {
                int page = (filter.getPage() == null || filter.getPage() < 1)
                                ? 0
                                : filter.getPage() - 1;

                int size = filter.getSize() != null
                                ? filter.getSize()
                                : 10;
                FilterValidator.validateDateRange(
                                filter.getStartDate(),
                                filter.getEndDate(),
                                "Ngày bắt đầu",
                                "Ngày kết thúc");
                String keyword = FilterValidator.normalizeKeyword(filter.getKeyword());

                BaseStatus status = FilterValidator.parseEnum(
                                filter.getStatus(),
                                BaseStatus.class,
                                "Trạng thái");

                PromotionCampaignType campaignType = FilterValidator.parseEnum(
                                filter.getPromotionCampaignType(),
                                PromotionCampaignType.class,
                                "Loại chương trình khuyến mãi");

                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                Sort.by(Sort.Direction.DESC, "id"));

                Page<PromotionResponse> result = promotionRepository
                                .searchPromotions(keyword, filter.getStartDate(), filter.getEndDate(), campaignType,
                                                status, pageable)
                                .map(promotionMapper::toDTO);

                return new PageResponse<>(
                                result.getContent(),
                                result.getNumber(),
                                result.getSize(),
                                result.getTotalElements(),
                                result.getTotalPages());
        }

        @Override
        public void insertData() {

                if (promotionRepository.count() > 0) {
                        return;
                }

                List<Promotion> promotions = new ArrayList<>();

                for (int i = 1; i <= 20; i++) {
                        Promotion promotion = new Promotion();

                        promotion.setName("Chương trình khuyến mãi " + i);
                        promotion.setCreatedAt(LocalDate.now().minusDays(i));

                        promotion.setStartDate(LocalDate.now().plusDays(i));
                        promotion.setExpireDate(LocalDate.now().plusDays(i + 10));

                        promotion.setPromotionCampaignType(
                                        i % 2 == 0
                                                        ? PromotionCampaignType.FLASH_SALE
                                                        : PromotionCampaignType.PRODUCT_DISCOUNT);

                        promotion.setStatus(
                                        i % 3 == 0
                                                        ? BaseStatus.INACTIVE
                                                        : BaseStatus.ACTIVE);

                        promotions.add(promotion);
                }

                promotionRepository.saveAll(promotions);
        }
}
