import { useState } from "react";
import { Minus, Plus, Trash2, Building2, BookOpen, Tag, Calendar, FileText, Weight, Languages, ChevronDown, ChevronUp } from "lucide-react";
import {
  type CartItemUI,
  getLineTotal,
} from "@/modules/user/cart/types/cart.type";
import { formatMoney } from "@/utils/number.utils";

type CartItemCardProps = {
  item: CartItemUI;
  onToggle: () => void;
  onUpdateQuantity: (delta: number) => void;
  onRemove?: () => void;
  showRemove?: boolean;
  readonly?: boolean;
};

export default function CartItemCard({
  item,
  onToggle,
  onUpdateQuantity,
  onRemove,
  showRemove = true,
  readonly = false,
}: CartItemCardProps) {
  const { product } = item;
  const [showDetails, setShowDetails] = useState(false);

  const originalPrice = product.discountValue > 0 ? product.price / (1 - product.discountValue / 100) : product.price;
  const hasDiscount = product.discountValue > 0;
  const imageUrl = product.coverImages?.find(img => img.isThumbnail)?.url || product.coverImages?.[0]?.url || "";

  return (
    <div
      className={`group card-custom-v1 py-4 transition-all duration-200
        shadow-[0_4px_12px_rgba(0,0,0,0.03)]
        hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]
        overflow-hidden
        ${
          item.checked
            ? "border-red-200 bg-red-50/10"
            : "border-slate-200/60 bg-white"
        }`}
    >
      {/* 💻 1. Giao diện Desktop (lg trở lên) - KHỚP TĂM TẮP VỚI TOOLBAR */}
      <div className={`hidden lg:grid ${readonly ? 'lg:grid-cols-[1fr_120px_120px_120px] px-4' : 'lg:grid-cols-[40px_1fr_120px_140px_120px_40px]'} lg:items-center `}>
        {/* Cột 1: Checkbox */}
        {!readonly && (
          <div className="flex justify-center items-center h-full">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={onToggle}
              className="h-5 w-5 shrink-0 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
            />
          </div>
        )}

        {/* Cột 2: Hình ảnh & Thông tin chi tiết sản phẩm */}
        <div className="flex items-center gap-4 min-w-0 pl-2">
          <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 shadow-sm">
            <img
              src={imageUrl}
              alt={product.name}
              className="h-[100px] w-[72px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            <h3 className="font-bold text-slate-900 line-clamp-2 text-sm md:text-base leading-snug hover:text-blue-600 transition cursor-pointer">
              {product.name}
            </h3>
            <div 
              className={`grid transition-all duration-300 ease-in-out ${
                showDetails ? "grid-rows-[1fr] opacity-100 mt-1.5" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-1 pb-1">
                  {/* Publisher */}
                  {product.productPublisher && (
                    <div className="flex">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100/50">
                        <Building2 size={10} />
                        <span>{product.productPublisher.name}</span>
                      </div>
                    </div>
                  )}
                  {/* Genres */}
                  {product.productGenres && product.productGenres.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      {product.productGenres.map((genre, index) => (
                        <div key={genre.id} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${index === 0 ? 'bg-indigo-50/50 text-indigo-600 border-indigo-100/50' : 'bg-slate-50/80 text-slate-500 border-slate-200/80'}`}>
                          {index === 0 ? <BookOpen size={10} /> : <Tag size={10} />}
                          <span>{genre.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-400">
                    {product.publishYear && (
                      <div className="flex items-center gap-1">
                        <Calendar size={10} className="text-slate-300" />
                        <span>{product.publishYear}</span>
                      </div>
                    )}
                    {product.pages > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText size={10} className="text-slate-300" />
                        <span>{product.pages} trang</span>
                      </div>
                    )}
                    {product.weight > 0 && (
                      <div className="flex items-center gap-1">
                        <Weight size={10} className="text-slate-300" />
                        <span>{product.weight}g</span>
                      </div>
                    )}
                    {product.language && (
                      <div className="flex items-center gap-1">
                        <Languages size={10} className="text-slate-300" />
                        <span>{product.language}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-0.5">
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); setShowDetails(!showDetails); }}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition"
              >
                {showDetails ? "Thu gọn" : "Xem thêm chi tiết"}
                {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Cột 3: Đơn giá */}
        <div className="text-right pr-2">
          {hasDiscount && (
            <p className="text-xs text-slate-400 line-through tabular-nums">
              {formatMoney(originalPrice)}
            </p>
          )}
          <p className="text-sm text-slate-900 font-bold tabular-nums mt-0.5">
            {formatMoney(product.price)}
          </p>
        </div>

        {/* Cột 4: Bộ tăng giảm số lượng */}
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-lg border border-slate-200/80 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(-1)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-900 transition active:scale-95"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(1)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-900 transition active:scale-95"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Cột 5: Thành tiền */}
        <div className="text-right pr-2">
          <p className="text-sm font-bold text-red-600 tabular-nums">
            {formatMoney(getLineTotal(item))}
          </p>
        </div>

        {/* Cột 6: Hành động xóa cá nhân */}
        {!readonly && (
          <div className="flex justify-center">
            {showRemove && onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition lg:opacity-0 group-hover:opacity-100"
                aria-label="Xóa sản phẩm"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 📟 2. Giao diện Tablet (sm đến md) */}
      <div className={`hidden sm:grid lg:hidden ${readonly ? 'sm:grid-cols-[1fr_auto_auto]' : 'sm:grid-cols-[auto_1fr_auto_auto_auto]'} sm:items-center gap-5 p-5`}>
        {!readonly && (
          <input
            type="checkbox"
            checked={item.checked}
            onChange={onToggle}
            className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
          />
        )}

        <div className="flex items-center gap-4 min-w-0">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-24 w-16 shrink-0 rounded-xl object-cover border border-slate-200/60"
          />
          <div className="min-w-0 flex flex-col gap-2">
            <h3 className="font-bold text-slate-900 line-clamp-2 text-sm md:text-base leading-snug hover:text-blue-600 transition cursor-pointer">
              {product.name}
            </h3>
            <div 
              className={`grid transition-all duration-300 ease-in-out ${
                showDetails ? "grid-rows-[1fr] opacity-100 mt-1.5" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-1 pb-1">
                  {/* Publisher */}
                  {product.productPublisher && (
                    <div className="flex">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100/50">
                        <Building2 size={10} />
                        <span>{product.productPublisher.name}</span>
                      </div>
                    </div>
                  )}
                  {/* Genres */}
                  {product.productGenres && product.productGenres.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      {product.productGenres.map((genre, index) => (
                        <div key={genre.id} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${index === 0 ? 'bg-indigo-50/50 text-indigo-600 border-indigo-100/50' : 'bg-slate-50/80 text-slate-500 border-slate-200/80'}`}>
                          {index === 0 ? <BookOpen size={10} /> : <Tag size={10} />}
                          <span>{genre.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-400">
                    {product.publishYear && (
                      <div className="flex items-center gap-1">
                        <Calendar size={10} className="text-slate-300" />
                        <span>{product.publishYear}</span>
                      </div>
                    )}
                    {product.pages > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText size={10} className="text-slate-300" />
                        <span>{product.pages} trang</span>
                      </div>
                    )}
                    {product.weight > 0 && (
                      <div className="flex items-center gap-1">
                        <Weight size={10} className="text-slate-300" />
                        <span>{product.weight}g</span>
                      </div>
                    )}
                    {product.language && (
                      <div className="flex items-center gap-1">
                        <Languages size={10} className="text-slate-300" />
                        <span>{product.language}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-0.5">
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); setShowDetails(!showDetails); }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 transition"
              >
                {showDetails ? "Thu gọn" : "Xem thêm chi tiết"}
                {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center border border-slate-200/60 rounded-lg overflow-hidden bg-slate-50/80">
          <button
            type="button"
            onClick={() => onUpdateQuantity(-1)}
            className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-white transition"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-slate-900">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(1)}
            className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-white transition"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="text-right min-w-30">
          {hasDiscount && (
            <p className="text-xs text-slate-400 line-through">
              {formatMoney(originalPrice)}
            </p>
          )}
          <p className="text-xs font-medium text-slate-500">
            {formatMoney(product.price)}
          </p>
          <p className="text-sm font-bold text-red-600 mt-1">
            {formatMoney(getLineTotal(item))}
          </p>
        </div>

        {!readonly && (
          <>
            {showRemove && onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
              >
                <Trash2 size={16} />
              </button>
            )}
          </>
        )}
      </div>

      {/* 📱 3. Giao diện Mobile */}
      <div className="sm:hidden p-2 space-y-3">
        <div className="flex gap-3">
          {!readonly && (
            <input
              type="checkbox"
              checked={item.checked}
              onChange={onToggle}
              className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
          )}

          <img
            src={imageUrl}
            alt={product.name}
            className="h-20 w-14 shrink-0 rounded-lg object-cover border border-slate-200/60"
          />
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="font-bold text-slate-900 line-clamp-2 text-xs hover:text-blue-600 transition">
              {product.name}
            </h3>
            
            <div 
              className={`grid transition-all duration-300 ease-in-out ${
                showDetails ? "grid-rows-[1fr] opacity-100 mt-1.5" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-1 pb-1">
                  {/* Publisher */}
                  {product.productPublisher && (
                    <div className="flex">
                      <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-medium border border-emerald-100/50">
                        <Building2 size={8} />
                        <span>{product.productPublisher.name}</span>
                      </div>
                    </div>
                  )}
                  {/* Genres */}
                  {product.productGenres && product.productGenres.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      {product.productGenres.map((genre, index) => (
                        <div key={genre.id} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[9px] font-medium border ${index === 0 ? 'bg-indigo-50/50 text-indigo-600 border-indigo-100/50' : 'bg-slate-50/80 text-slate-500 border-slate-200/80'}`}>
                          {index === 0 ? <BookOpen size={8} /> : <Tag size={8} />}
                          <span>{genre.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-slate-400">
                    {product.publishYear && (
                      <div className="flex items-center gap-0.5">
                        <Calendar size={8} className="text-slate-300" />
                        <span>{product.publishYear}</span>
                      </div>
                    )}
                    {product.pages > 0 && (
                      <div className="flex items-center gap-0.5">
                        <FileText size={8} className="text-slate-300" />
                        <span>{product.pages} trang</span>
                      </div>
                    )}
                    {product.weight > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Weight size={8} className="text-slate-300" />
                        <span>{product.weight}g</span>
                      </div>
                    )}
                    {product.language && (
                      <div className="flex items-center gap-0.5">
                        <Languages size={8} className="text-slate-300" />
                        <span>{product.language}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-0.5 flex items-center">
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); setShowDetails(!showDetails); }}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-blue-600 transition"
              >
                {showDetails ? "Thu gọn" : "Xem thêm chi tiết"}
                {showDetails ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            </div>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
              <span className="text-xs font-bold text-slate-900">
                {formatMoney(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-slate-400 line-through">
                  {formatMoney(originalPrice)}
                </span>
              )}
            </div>
          </div>
          {showRemove && onRemove && !readonly && (
            <button
              type="button"
              onClick={onRemove}
              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between pl-8">
          <div className="flex items-center border border-slate-200/60 rounded-md overflow-hidden bg-slate-50/80">
            <button
              type="button"
              onClick={() => onUpdateQuantity(-1)}
              className="flex h-7 w-7 items-center justify-center text-slate-600"
            >
              <Minus size={12} />
            </button>
            <span className="w-7 text-center text-xs font-semibold">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(1)}
              className="flex h-7 w-7 items-center justify-center text-slate-600"
            >
              <Plus size={12} />
            </button>
          </div>
          <p className="text-sm font-bold text-red-600">
            {formatMoney(getLineTotal(item))}
          </p>
        </div>
      </div>
    </div>
  );
}
