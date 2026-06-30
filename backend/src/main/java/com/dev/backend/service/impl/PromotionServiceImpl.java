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
import com.dev.backend.dto.promotion.PromotionFilter;
import com.dev.backend.dto.promotion.PromotionRequest;
import com.dev.backend.dto.promotion.PromotionResponse;
import com.dev.backend.entity.Promotion;
import com.dev.backend.mapper.PromotionMapper;
import com.dev.backend.repository.PromotionRepository;
import com.dev.backend.response.PageResponse;
import com.dev.backend.service.PromotionService;
import com.dev.backend.util.FilterValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    private Promotion setPromotionRequest(Promotion promotion, PromotionRequest request) {
        promotion.setName(request.getName());
        promotion.setStartDate(request.getCreateDate());
        promotion.setExpireDate(request.getEndDate());
        promotion.setStatus(BaseStatus.from(request.getStatus()));
        promotion.setPromotionCampaignType(
                PromotionCampaignType.from(request.getPromotionCampaignType()));
        return promotion;
    }

    @Override
    public Promotion addPromotion(PromotionRequest promotionRequest) {
        Promotion promotion = new Promotion();
        setPromotionRequest(promotion, promotionRequest);

        Promotion saved = savePromotion(promotion);
        return null;
    }

    @Override
    public Promotion findById(Integer id) {
        // TODO Auto-generated method stub
        return null;
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
    public PageResponse<PromotionResponse> pages(PromotionFilter filter) {
        FilterValidator.validatePage(filter.getPage(), filter.getSize());
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
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "id"));

        Page<PromotionResponse> result = promotionRepository
                .searchPromotions(keyword, filter.getStartDate(), filter.getEndDate(), campaignType, status, pageable)
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
