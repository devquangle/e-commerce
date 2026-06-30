import type { ProductCard as ProductCardType } from "@/types/product.card.type";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMoney, formatCompactNumber } from "@/utils/number.utils";

interface Props {
  product: ProductCardType;
}

export default function ProductCard({ product }: Props) {
  const discountValue = product.promotion?.value || 0;
  const hasDiscount = discountValue > 0;
  
  const originalPrice = hasDiscount
    ? Math.round(product.price / (1 - discountValue / 100))
    : product.price;

  return (
    <Link
      to={`/product?slug=${product.slug}`}
      className="
        group flex h-full flex-col overflow-hidden card-custom-v1
        shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]
        hover:-translate-y-1 transition-all duration-300 ease-out relative
      "
    >
      {/* Coral Discount Badge Overlay */}
      {hasDiscount && (
        <div className="absolute -top-px -right-px z-10">
          <span className="inline-flex items-center px-3  rounded-tr-lg rounded-bl-lg text-[10px] font-bold bg-[#ff7f50] text-white shadow-xs tracking-wide py-2">
            -{discountValue}%
          </span>
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="relative w-full h-0 pb-[133.33%] bg-slate-50/50 overflow-hidden shrink-0 select-none">
        <img
          src={product.urlImage}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
      </div>

      {/* CONTENT SECTION */}
      <div className="flex flex-1 flex-col p-4">
        {/* Book Title */}
        <h3
          className="
            line-clamp-2 min-h-[2.5em] text-[13px] sm:text-[14px] font-bold leading-snug
            text-slate-800 transition-colors group-hover:text-[#ff7f50] mb-2
          "
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Ratings & Sold Count */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {product.rating && product.rating > 0 ? (
              <>
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-[12px] font-semibold text-slate-700 ml-0.5">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400 ml-0.5">
                  ({product.reviewCount || 0})
                </span>
              </>
            ) : (
              <span className="text-[11px] text-slate-400 italic">
                Chưa có đánh giá
              </span>
            )}
          </div>
          {product.soldCount !== undefined && product.soldCount > 0 && (
            <>
              <span className="text-[10px] text-slate-300 select-none">•</span>
              <span className="text-[11px] font-medium text-slate-500">
                Đã bán {formatCompactNumber(product.soldCount)}
              </span>
            </>
          )}
        </div>

        {/* Price Area */}
        <div className="mt-auto pt-2.5 border-t border-slate-50 flex items-baseline gap-2 flex-wrap">
          <span className="text-[15px] sm:text-[17px] font-bold text-rose-600 tracking-tight">
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
