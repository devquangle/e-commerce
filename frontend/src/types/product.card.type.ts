type PromotionCampaignType =
  | "FLASH_SALE"
  | "PRODUCT_DISCOUNT"
  | "SEASONAL"
  | null;
type ProductBadge = "FLASH_SALE" | "BEST_SELLER" | "NEW" | null;
export interface ProductCard {
  id: number;
  slug: string; //url
  name: string;
  soldCount: number; // đã bán
  rating: number; // 0 → 5
  reviewCount: number; // số lượt đánh giá
  price: number;
  createdAt: string;
  badge: ProductBadge;
  urlImage: string;
  promotion: PromotionResponse;
}

export interface PromotionResponse {
  value: number;
  type: PromotionCampaignType;
}
