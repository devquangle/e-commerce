
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
        <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition">

            {/* IMAGE */}
            <div className="relative aspect-5/6  overflow-hidden bg-slate-100">

                {/* Discount LEFT */}
                {discount && (
                    <span className="absolute left-2 top-2 z-10 rounded-md bg-red-500 px-2 py-1 text-[11px] font-bold text-white">
                        -{discount}%
                    </span>
                )}

                {/* Badge RIGHT */}
                {badge && (
                    <span
                        className={`absolute right-2 top-2 z-10 rounded-full px-2 py-0.5 text-[11px] font-medium ${badge.className}`}
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
            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-blue-500">
                    {product.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                    {product.author.join(", ")}
                </p>

                {/* Rating + Sold */}
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-0.5 text-amber-500">
                        ★ {product.rating.toFixed(1)}
                    </span>
                    <span>({product.reviewCount})</span>
                    <span>•</span>
                    <span>Đã bán {product.soldCount}</span>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-center justify-start gap-2">
                    <p className="text-lg font-bold text-blue-500">
                        {product.price.toLocaleString()} ₫
                    </p>

                    {product.originalPrice && (
                        <p className="text-md text-slate-400 line-through">
                            {product.originalPrice.toLocaleString()} ₫
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
