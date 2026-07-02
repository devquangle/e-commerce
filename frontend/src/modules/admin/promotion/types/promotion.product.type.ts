import type { PromotionCampaignType } from "./promotion.type";
import type { ProductResponse } from "@/modules/admin/product/types/product.type";

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

export interface ProductWithPromotions {
  product: ProductResponse;
  promotions: PromotionProductDetailResponse[];
}
