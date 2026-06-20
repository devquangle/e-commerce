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
        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider rounded-full">
          Sách bán chạy
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-slate-900 leading-tight mb-4">
        {product.name}
      </h1>

      <div className="flex flex-col gap-3 text-sm text-slate-600 mb-6">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-900 text-base ml-1">
              {rating}
            </span>
            <span className="text-slate-500">
              ({reviewCount} đánh giá)
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div>
            Đã bán{" "}
            <span className="font-semibold text-slate-900">
              {soldCount}
            </span>
          </div>
        </div>

        {product.productAuthors && product.productAuthors.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="whitespace-nowrap mt-0.5">Tác giả:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.productAuthors.map(author => (
                <span key={author.id} className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium cursor-pointer hover:bg-blue-100 transition-colors">
                  {author.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.productGenres && product.productGenres.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="whitespace-nowrap mt-0.5">Thể loại:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.productGenres.map(genre => (
                <span key={genre.id} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-md font-medium cursor-pointer hover:bg-slate-200 transition-colors">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {product.publisherName && (
          <div className="flex items-center gap-2">
            <span>Nhà xuất bản:</span>
            <span className="font-semibold text-slate-900">{product.publisherName}</span>
          </div>
        )}

        {product.seriesName && (
          <div className="flex items-center gap-2">
            <span>Series:</span>
            <span className="font-semibold text-slate-900">{product.seriesName}</span>
          </div>
        )}
      </div>

      <div className="bg-slate-50/80 rounded-2xl p-6 mb-8 border border-slate-100">
        <div className="flex items-end gap-4">
          <span className="text-3xl md:text-4xl font-extrabold text-blue-600">
            {price.toLocaleString()} ₫
          </span>
          {originalPrice > price && (
            <>
              <span className="text-lg text-slate-400 line-through mb-1 font-medium">
                {originalPrice.toLocaleString()} ₫
              </span>
              <span className="mb-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* ACTION AREA */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8 border-b border-slate-200 pb-8">
        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-700">
            Số lượng
          </span>
          <div className="flex items-center border border-slate-200 rounded-xl h-12 w-36 bg-white overflow-hidden shadow-sm">
            <button
              onClick={handleDecrease}
              className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <Minus size={18} />
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="w-full h-full text-center font-semibold text-slate-900 border-x border-slate-200 focus:outline-none"
            />
            <button
              onClick={handleIncrease}
              className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex-1 flex gap-3 items-end">
          <button className="h-12 px-6 bg-blue-50 text-blue-600 font-semibold rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none">
            <ShoppingCart size={20} />
            <span>Thêm vào giỏ</span>
          </button>
          <button className="h-12 px-8 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all flex-1">
            Mua ngay
          </button>
          <button className="h-12 w-12 flex items-center justify-center border border-slate-200 rounded-xl text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
            <Heart size={22} />
          </button>
        </div>
      </div>

      {/* PERKS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50/50 text-green-700">
          <ShieldCheck size={24} className="opacity-80" />
          <span className="text-sm font-medium">
            100% Sách gốc, chất lượng cao
          </span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 text-blue-700">
          <Truck size={24} className="opacity-80" />
          <span className="text-sm font-medium">
            Giao hàng siêu tốc trong 2h
          </span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 text-amber-700">
          <RotateCcw size={24} className="opacity-80" />
          <span className="text-sm font-medium">
            Đổi trả miễn phí trong 30 ngày
          </span>
        </div>
      </div>
    </div>
  );
}
