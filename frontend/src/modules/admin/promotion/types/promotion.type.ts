import { BaseStatus } from "@/types/status";

export type PromotionCampaignType =
  | "FLASH_SALE"
  | "PRODUCT_DISCOUNT"
  | "SEASONAL";
export const campaignTypeLabels: Record<PromotionCampaignType, string> = {
  FLASH_SALE: "Flash Sale",
  PRODUCT_DISCOUNT: "Giảm giá sản phẩm",
  SEASONAL: "Khuyến mãi theo mùa",
};
export interface PromotionResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: BaseStatus;
  promotionCampaignType: PromotionCampaignType;
}

export interface PromotionRequest {
  name: string;
  startDate: string;
  endDate: string;
  status: BaseStatus;
  promotionCampaignType: PromotionCampaignType;
  promotionProducts: PromotionProductResponse[] | [];
}

export interface PromotionProductResponse {
  productId: number;
  localDiscount: number;
  localQty: number;
}

export interface PromotionDetailResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: BaseStatus;
  promotionCampaignType: PromotionCampaignType;
  promotionProducts: PromotionProductResponse[] | [];
}

