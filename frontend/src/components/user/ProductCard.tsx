import type { ProductCard as ProductCardType, ProductBadge, PromotionCampaignType } from "@/types/product.card.type";
import { getProductBadgeLabel, getPromotionCampaignLabel } from "@/types/product.card.type";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney, formatCompactNumber } from "@/utils/number.utils";

interface Props {
  product: ProductCardType;
}

const getDiscountColor = (value: number) => {
  if (value >= 50) return "bg-rose-500";
  if (value >= 20) return "bg-orange-500";
  return "bg-amber-500";
};

const getBadgeColor = (badge: ProductBadge | undefined | null) => {
  if (badge === "BEST_SELLER") return "bg-orange-500";
  if (badge === "NEW") return "bg-emerald-500";
  if (badge === "FLASH_SALE") return "bg-rose-500";
  return "bg-indigo-500";
};

const getCampaignColor = (type: PromotionCampaignType | undefined | null) => {
  if (type === "FLASH_SALE") return "bg-rose-500";
  if (type === "SEASONAL") return "bg-blue-500";
  return "bg-amber-500";
};

export default function ProductCard({ product }: Props) {
  const discountValue = product.promotion?.value || 0;
  const hasDiscount = discountValue > 0;
  
  const originalPrice = hasDiscount
    ? Math.round(product.price / (1 - discountValue / 100))
    : product.price;

  const badgeLabel = product.badge ? getProductBadgeLabel(product.badge) : null;
  const campaignLabel = product.promotion?.type ? getPromotionCampaignLabel(product.promotion.type) : null;

  return (
    <Link
      to={`/product/${product.slug || product.id}`}
      className="
        group flex h-full flex-col overflow-hidden
        rounded-sm bg-white border border-slate-100/80 shadow-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
        relative
      "
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden shrink-0">
        <img
          src={product.urlImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-2 transition-opacity duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-100/60 to-transparent pointer-events-none" />
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Title */}
        <h3
          className="
            line-clamp-2 min-h-[2.8em] text-[13px] sm:text-[14px] font-medium leading-relaxed
            text-slate-800 transition-colors group-hover:text-blue-600 mb-2
          "
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Badges dưới title */}
        {(hasDiscount || badgeLabel) && (
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            {badgeLabel && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wide ${getBadgeColor(product.badge)}`}>
                {badgeLabel}
              </span>
            )}
            {hasDiscount && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white ${getDiscountColor(discountValue)}`}>
                -{discountValue}%
              </span>
            )}
          </div>
        )}

        {/* Rating & Sold Count */}
        <div className="mt-auto flex items-center gap-1.5 text-[12px] text-slate-500 mb-3">
          <div className="flex items-center text-amber-400">
            <Star size={13} className="fill-current" />
            <span className="ml-1 font-semibold text-slate-700">
              {product.rating ? product.rating.toFixed(1) : "0.0"}
            </span>
          </div>
          <span>({product.reviewCount || 0})</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="truncate">{formatCompactNumber(product.soldCount || 0)} đã bán</span>
        </div>

        {/* Price Area */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[16px] sm:text-[18px] font-bold text-rose-600 tracking-tight">
            {formatMoney(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[12px] font-medium text-slate-400 line-through">
              {formatMoney(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
