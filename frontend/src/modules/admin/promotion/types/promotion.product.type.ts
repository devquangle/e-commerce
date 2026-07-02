import type { PromotionCampaignType } from "./promotion.type";

export interface PromotionProductMappingResponse {
  productId: number;
  promotions: PromotionProductDetailResponse[] | [];
}

export interface PromotionProductDetailResponse {
  promotionProductId: number;
  promotionId: number;
  name: string;
  promotionCampaignType: PromotionCampaignType;
  maxQuantity: number;
  discountValue: number;
  startDate: string;
  endDate?: string;
  expireDate: string;
}
