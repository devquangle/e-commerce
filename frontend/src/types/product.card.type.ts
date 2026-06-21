export type PromotionCampaignType =
  | "FLASH_SALE"
  | "PRODUCT_DISCOUNT"
  | "SEASONAL"
  | null;

export type ProductBadge =
  | "FLASH_SALE"
  | "BEST_SELLER"
  | "NEW"
  | null;

export const PRODUCT_BADGES: Record<
  Exclude<ProductBadge, null>,
  { label: string }
> = {
  FLASH_SALE: {
    label: "Flash Sale",
  },

  BEST_SELLER: {
    label: "Bán chạy",
  },

  NEW: {
    label: "Mới",
  },
};

export const PROMOTION_CAMPAIGNS: Record<
  Exclude<PromotionCampaignType, null>,
  { label: string }
> = {
  FLASH_SALE: {
    label: "Flash Sale",
  },

  PRODUCT_DISCOUNT: {
    label: "Giảm giá sản phẩm",
  },

  SEASONAL: {
    label: "Khuyến mãi theo mùa",
  },
};

export const getProductBadge = (
  badge: ProductBadge
): { label: string } | null => {
  if (!badge) {
    return null;
  }

  return PRODUCT_BADGES[badge];
};

export const getPromotionCampaign = (
  type: PromotionCampaignType
): { label: string } | null => {
  if (!type) {
    return null;
  }

  return PROMOTION_CAMPAIGNS[type];
};

export const getProductBadgeLabel = (
  badge: ProductBadge
): string => {
  return getProductBadge(badge)?.label ?? "";
};

export const getPromotionCampaignLabel = (
  type: PromotionCampaignType
): string => {
  return getPromotionCampaign(type)?.label ?? "";
};
export interface ProductCard {
  id: number;
  slug: string; //url
  name: string;
  soldCount: number; // đã bán
  rating: number; // 0 → 5
  reviewCount: number; // số lượt đánh giá
  price: number;
  createdAt?: string;
  badge?: ProductBadge;
  urlImage: string;
  promotion?: PromotionResponse;
  bage?: string;
  promosionValue?: number;
}

export interface PromotionResponse {
  value: number;
  type: PromotionCampaignType;
}
