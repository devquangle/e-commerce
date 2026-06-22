import type { ProductCard as ProductCardType, ProductBadge,  } from "@/types/product.card.type";
import { getProductBadgeLabel } from "@/types/product.card.type";
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



export default function ProductCard({ product }: Props) {
  const discountValue = product.promotion?.value || 0;
  const hasDiscount = discountValue > 0;
  
  const originalPrice = hasDiscount
    ? Math.round(product.price / (1 - discountValue / 100))
    : product.price;

  const badgeLabel = product.badge ? getProductBadgeLabel(product.badge) : null;

  return (
    <Link
      to={`/product?slug=${product.slug}`}
      className="
        group flex h-full flex-col overflow-hidden
        card-custom
        transition-all duration-500 ease-out
        hover:-translate-y-1.5 hover:border-indigo-100 hover:shadow-[0_12px_40px_-12px_rgba(79,70,229,0.15)]
        relative
      "
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-3/4 w-full bg-slate-50/80 overflow-hidden shrink-0 flex items-center justify-center">
        <img
          src={product.urlImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-auto object-contain drop-shadow-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3
          className="
            line-clamp-2 min-h-[2.75em] text-[13px] sm:text-[14px] font-semibold leading-snug
            text-slate-800 transition-colors group-hover:text-indigo-600 mb-2.5
          "
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Badges dưới title */}
        {(hasDiscount || badgeLabel) && (
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
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

        {/* Footer (Rating, Sold, Price) always at bottom */}
        <div className="mt-auto flex flex-col gap-3">
          {/* Rating & Sold Count */}
          <div className="flex items-center justify-between w-full">
            {/* Left: Rating */}
            <div className="flex items-center gap-1">
              {product.rating && product.rating > 0 ? (
                <>
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-[13px] font-semibold text-slate-700">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-[12px] text-slate-400 ml-0.5">
                    ({product.reviewCount || 0})
                  </span>
                </>
              ) : (
                <span className="text-[12px] text-slate-500 italic">
                  Chưa có đánh giá
                </span>
              )}
            </div>

            {/* Right: Sold Count */}
            <div className="flex items-center">
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-full border border-slate-200/50">
                Đã bán {formatCompactNumber(product.soldCount || 0)}
              </span>
            </div>
          </div>

          {/* Price Area */}
          <div className="flex items-baseline gap-2 flex-wrap pt-2 border-t border-slate-50/80">
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
      </div>
    </Link>
  );
}
