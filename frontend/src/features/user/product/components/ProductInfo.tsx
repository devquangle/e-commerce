import { useState } from "react";
import { Star, Minus, Plus, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import type { ProductResponse } from "../types/product.detail.type";

interface ProductInfoProps {
  product: Partial<ProductResponse>;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
}

export default function ProductInfo({ product, rating = 0, reviewCount = 0, soldCount = 0 }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  const price = product.price || 0;
  const originalPrice = product.originalPrice || price;
  const discountPercent = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;
  
  return (
    <div className="lg:col-span-6 xl:col-span-8 flex flex-col">
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2.5 py-1 bg-orange-50 text-orange-500 text-[11px] font-bold uppercase tracking-wider rounded-md">
          SÁCH BÁN CHẠY
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4">
        {product.name}
      </h1>

      <div className="flex flex-col gap-3 text-sm text-slate-600 mb-6">
        {/* Rating & Sold */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-slate-900 ml-1">
              {rating.toFixed(1)}
            </span>
            <span className="text-slate-500">
              ({reviewCount} đánh giá)
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <div>
            Đã bán{" "}
            <span className="font-semibold text-slate-900">
              {soldCount}
            </span>
          </div>
        </div>

        {/* Tác giả */}
        {product.productAuthors && product.productAuthors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-slate-500">Tác giả:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.productAuthors.map((author, idx) => (
                <span key={author.id}>
                  <a href="#" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors">
                    {author.name}
                  </a>
                  {idx < product.productAuthors!.length - 1 && <span className="text-slate-400">,</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Thể loại */}
        {product.productGenres && product.productGenres.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-slate-500">Thể loại:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.productGenres.map((genre, idx) => (
                <span key={genre.id}>
                  <a href="#" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors">
                    {genre.name}
                  </a>
                  {idx < product.productGenres!.length - 1 && <span className="text-slate-400">,</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* NXB & Series */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          {product.publisherName && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Nhà xuất bản:</span>
              <span className="font-bold text-slate-800">{product.publisherName}</span>
            </div>
          )}
          
          {product.seriesName && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Series:</span>
              <span className="font-bold text-slate-800">{product.seriesName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Giá */}
      <div className="bg-slate-50 rounded-2xl p-5 mb-8">
        <div className="flex items-end gap-3 flex-wrap">
          <span className="text-3xl font-extrabold text-blue-600">
            {price.toLocaleString()} ₫
          </span>
          {originalPrice > price && (
            <>
              <span className="text-base text-slate-400 line-through mb-1 font-medium">
                {originalPrice.toLocaleString()} ₫
              </span>
              <span className="mb-1.5 px-2 py-0.5 bg-rose-50 text-rose-600 text-[11px] font-bold rounded">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Hành động (Mua, Giỏ, Yêu thích) */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8 border-b border-slate-100 pb-8">
        {/* Số lượng */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">
            Số lượng
          </span>
          <div className="flex items-center border border-slate-200 rounded-xl h-11 w-32 bg-white overflow-hidden shadow-sm">
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

        {/* Buttons */}
        <div className="flex-1 flex gap-3 items-end">
          <button className="h-11 px-5 bg-blue-50 text-blue-600 text-sm font-bold rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none">
            <ShoppingCart size={18} />
            <span>Thêm vào giỏ</span>
          </button>
          <button className="h-11 px-8 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all flex-1">
            Mua ngay
          </button>
          <button className="h-11 w-11 flex items-center justify-center border border-slate-200 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all shrink-0">
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* Ưu đãi / Cam kết */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2.5 p-3 rounded-lg border border-green-100 bg-green-50/30 text-green-700">
          <ShieldCheck size={20} className="shrink-0" />
          <span className="text-xs font-medium">
            100% Sách gốc, chất lượng cao
          </span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-lg border border-blue-100 bg-blue-50/30 text-blue-700">
          <Truck size={20} className="shrink-0" />
          <span className="text-xs font-medium">
            Giao hàng siêu tốc trong 2h
          </span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-lg border border-orange-100 bg-orange-50/30 text-orange-700">
          <RotateCcw size={20} className="shrink-0" />
          <span className="text-xs font-medium">
            Đổi trả miễn phí trong 30 ngày
          </span>
        </div>
      </div>
    </div>
  );
}
