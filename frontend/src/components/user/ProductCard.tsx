import { getProductBadge } from "@/utils/getProductBadge";
import { getDiscountPercent } from "@/utils/getDiscountPercent";
import type { Product } from "@/types/product.type";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

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
    <Link
      to={`/product/${product.id}`}
      className="
        group
        flex h-full flex-col
        overflow-hidden
        rounded-2xl
        bg-white
        border border-slate-100/80
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[0_12px_24px_-6px_rgba(0,0,0,0.12)]
        relative
      "
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-4/5 bg-slate-50 overflow-hidden">
        {discount && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {badge && (
          <span
            className={`absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide shadow-sm backdrop-blur-sm ${badge.className}`}
          >
            {badge.text}
          </span>
        )}

        <img
          src={product.coverUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* QUICK ADD BUTTON OVERLAY */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hidden lg:block">
          <button 
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic here
            }}
            className="w-full bg-white/95 backdrop-blur-sm hover:bg-blue-600 hover:text-white text-slate-800 font-semibold py-2.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart size={16} />
            <span>Thêm vào giỏ</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4">
        {/* TOP */}
        <div className="space-y-1.5">
          <p className="truncate text-[13px] text-slate-500 font-medium">
            {product.author.join(", ")}
          </p>

          <h3
            className="
              line-clamp-2
              min-h-[2.7em]
              text-sm md:text-[15px]
              font-semibold
              leading-snug
              text-slate-800
              transition-colors
              group-hover:text-blue-600
            "
            title={product.title}
          >
            {product.title}
          </h3>

          <div className="flex items-center gap-1.5 text-[13px] text-slate-500 pt-1">
            <div className="flex items-center text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <span className="ml-0.5 font-medium text-slate-700">{product.rating.toFixed(1)}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>Đã bán {product.soldCount}</span>
          </div>
        </div>

        {/* PRICE */}
        <div className="mt-auto pt-4 flex flex-wrap items-baseline gap-2">
          <span className="text-base md:text-lg font-bold text-blue-600">
            {product.price.toLocaleString()} ₫
          </span>

          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[13px] text-slate-400 line-through font-medium">
              {product.originalPrice.toLocaleString()} ₫
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
