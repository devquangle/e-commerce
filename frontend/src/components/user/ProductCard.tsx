import { getProductBadge } from "@/utils/getProductBadge";
import { getDiscountPercent } from "@/utils/getDiscountPercent";
import type { Product } from "@/types/Product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const badge = getProductBadge(product);
  const discount = getDiscountPercent(
    product.price,
    product.originalPrice
  );

  return (
    <div
      className="
        group
        flex h-full flex-col
        overflow-hidden
        rounded-lg
        shadow
        border border-slate-100
        bg-white
        transition
        hover:-translate-y-0.5
    
      "
    >
      {/* IMAGE */}
      <div className="relative aspect-3/4 lg:aspect-5/6 bg-slate-100">
        {discount && (
          <span className="absolute left-2 top-2 z-10 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}

        {badge && (
          <span
            className={`absolute right-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] ${badge.className}`}
          >
            {badge.text}
          </span>
        )}

        <img
          src={product.coverUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover "
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col px-2.5 py-2 lg:px-3">
        {/* TOP */}
        <div className="space-y-1">
          <h3
            className="
              line-clamp-2
              wrap-break-word
              min-h-[2.4em]
              text-sm lg:text-base
              font-medium
              leading-snug
              text-slate-800
              group-hover:text-blue-600
            "
          >
            {product.title}
          </h3>

          <p className="truncate text-xs text-slate-500">
            {product.author.join(", ")}
          </p>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="font-medium text-amber-500">
              ★ {product.rating.toFixed(1)}
            </span>
            <span>({product.reviewCount})</span>
            <span className="hidden sm:inline">
              • {product.soldCount} bán
            </span>
          </div>
        </div>

        {/* PRICE */}
        <div className="mt-auto pt-1 flex items-center gap-2">
          <p className="text-sm lg:text-base font-bold text-blue-600">
            {product.price.toLocaleString()} ₫
          </p>

          {product.originalPrice &&
            product.originalPrice > product.price && (
              <p className="text-xs text-slate-400 line-through">
                {product.originalPrice.toLocaleString()} ₫
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
