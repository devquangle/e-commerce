import { useState } from "react";
import { Star, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import type { ProductResponse } from "../types/product.detail.type";

interface ProductInfoProps {
  product: Partial<ProductResponse>;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
}

export default function ProductInfo({ 
  product, 
  rating = 0, 
  reviewCount = 0, 
  soldCount = 0
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  const price = product.price || 0;
  const originalPrice = product.originalPrice || price;
  const discountPercent = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;
  
  return (
    <div className="flex flex-col gap-5">
      <div>
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-700 text-[11px] font-extrabold uppercase tracking-wider rounded-full border border-amber-500/20 flex items-center gap-1.5 w-fit">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            Sách bán chạy
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-3 tracking-tight">
          {product.name}
        </h1>

        {/* Rating & Sold Info */}
        <div className="flex items-center flex-wrap gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1 bg-amber-500/5 px-2.5 py-1 rounded-full border border-amber-500/10 text-amber-600 font-semibold">
            <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className="hover:text-blue-600 cursor-pointer transition-colors duration-200">
            <span className="font-semibold text-slate-800">{reviewCount}</span> đánh giá
          </div>
          <span className="text-slate-200">|</span>
          <div>
            Đã bán <span className="font-semibold text-slate-800">{soldCount}</span> cuốn
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-100/80 p-5 rounded-2xl">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Giá bán</div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl md:text-4xl font-extrabold text-blue-600 tracking-tight">
            {price.toLocaleString()} ₫
          </span>
          {originalPrice > price && (
            <div className="flex items-center gap-2">
              <span className="text-base text-slate-400 line-through font-medium">
                {originalPrice.toLocaleString()} ₫
              </span>
              <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-lg shadow-sm shadow-rose-500/10">
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Controls & Buttons */}
      <div className="flex flex-col gap-4 mb-4 border-b border-slate-100 pb-5">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          {/* Quantity Selector */}
          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Số lượng
            </span>
            <div className="flex items-center border border-slate-200 rounded-xl h-12 w-32 bg-white overflow-hidden shadow-sm">
              <button
                onClick={handleDecrease}
                className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                value={quantity}
                readOnly
                className="w-full h-full text-center text-sm font-semibold text-slate-900 border-x border-slate-200 focus:outline-none"
              />
              <button
                onClick={handleIncrease}
                className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex-1 flex gap-3 w-full items-center">
            <button className="h-12 px-6 bg-rose-50/50 hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-sm font-bold rounded-xl border border-rose-200 hover:border-rose-300 transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap">
              <ShoppingCart size={18} />
              <span>Thêm vào giỏ</span>
            </button>
            
            <button className="h-12 w-12 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm shrink-0">
              <Heart size={20} />
            </button>

            <button className="h-12 px-8 bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-red-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex-1">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
