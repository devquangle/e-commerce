package com.dev.backend.service.impl;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.constant.PromotionCampaignType;
import com.dev.backend.dto.promotion.PromotionRequest;
import com.dev.backend.entity.Promotion;
import com.dev.backend.repository.PromotionRepository;
import com.dev.backend.service.PromotionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository promotionRepository;

    @Override
    public Promotion addPromotion(PromotionRequest promotionRequest) {
        Promotion promotion = new Promotion();
        promotion.setName(promotionRequest.getName());
        promotion.setCreatedAt(LocalDate.now());
        promotion.setStartDate(LocalDate.parse(promotionRequest.getCreateDate()));
        promotion.setExpireDate(LocalDate.parse(promotionRequest.getEndDate()));
        promotion.setStatus(BaseStatus.valueOf(promotionRequest.getStatus()));
        promotion.setPromotionCampaignType(PromotionCampaignType.valueOf(promotionRequest.getPromotionCampaignType()));
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
}
