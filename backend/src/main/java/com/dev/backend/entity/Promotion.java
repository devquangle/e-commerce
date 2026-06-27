package com.dev.backend.entity;

import java.time.LocalDateTime;

import com.dev.backend.constant.BaseStatus;
import com.dev.backend.constant.PromotionCampaignType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    private LocalDateTime createdAt;
    private LocalDateTime startDate;
    private LocalDateTime expireDate;

    @Enumerated(EnumType.STRING)
    private PromotionCampaignType promotionCampaignType;

    @Enumerated(EnumType.STRING)
    private BaseStatus status;

}
