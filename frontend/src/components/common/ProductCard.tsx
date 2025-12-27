
import { getProductBadge } from "@/utils/getProductBadge";
import { getDiscountPercent } from "@/utils/getDiscountPercent";
import type { Product } from "@/types/Product";

interface Props {
    product: Product;
}
export default function ProductCard({ product }: Props) {
  const badge = getProductBadge(product);
  const discount = getDiscountPercent(product.price, product.originalPrice);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* IMAGE */}
      <div className="relative aspect-3/4 max-h-[300px] overflow-hidden bg-slate-100">
        {discount && (
          <span className="absolute left-1.5 top-1.5 z-10 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}

        {badge && (
          <span
            className={`absolute right-1.5 top-1.5 z-10 rounded-full px-1.5 py-0.5 text-[10px] ${badge.className}`}
          >
            {badge.text}
          </span>
        )}

        <img
          src={product.coverUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="flex min-h-[120px] flex-col p-2.5">

        {/* TITLE */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-slate-900 group-hover:text-blue-500">
          {product.title}
        </h3>

        {/* AUTHOR */}
        <p className="mt-0.5 truncate text-[11px] text-slate-500">
          {product.author.join(", ")}
        </p>

        {/* Rating + Sold */}
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-0.5 text-amber-500">
            ★ {product.rating.toFixed(1)}
          </span>
          <span>({product.reviewCount})</span>
          <span className="truncate">• {product.soldCount} bán</span>
        </div>

        {/* PRICE */}
        <div className="mt-auto flex items-center gap-1.5 pt-1">
          <p className="text-sm font-bold text-blue-500">
            {product.price.toLocaleString()} ₫
          </p>

          {product.originalPrice && (
            <p className="text-xs text-slate-400 line-through">
              {product.originalPrice.toLocaleString()} ₫
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
