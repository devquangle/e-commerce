import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  BookOpen,
  Tag,
  Calendar,
  FileText,
  Weight,
  Languages,
  ChevronDown,
  ChevronUp,
  User,
  Bookmark,
} from "lucide-react";
import type { OrderItemResponse } from "../types/order.type";
import { formatMoney } from "@/utils/number.utils";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";
import { getName, registerLocale } from "@cospired/i18n-iso-languages";
registerLocale(viLocale);

type OrderItemCardProps = {
  item: OrderItemResponse;
};

const getLanguageName = (code?: string) => {
  if (!code) return "";
  const name = getName(code, "vi");
  if (!name) return code;
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const formatFieldText = (value?: string | null): string => {
  if (!value || !value.trim() || value.trim().toLowerCase() === "khác") {
    return "Chưa cập nhật";
  }
  return value.trim();
};

const formatArrayText = (items?: string[] | null): string[] => {
  if (!items || items.length === 0) {
    return ["Chưa cập nhật"];
  }
  const formatted = items.map((item) =>
    !item || !item.trim() || item.trim().toLowerCase() === "khác"
      ? "Chưa cập nhật"
      : item.trim()
  );
  if (formatted.every((item) => item === "Chưa cập nhật")) {
    return ["Chưa cập nhật"];
  }
  return formatted;
};

export function OrderItemCard({ item }: OrderItemCardProps) {
  const product = item.productInfo;
  const [showDetails, setShowDetails] = useState(false);

  const unitPrice = item.price;
  const originalPrice = item.originalPrice;
  const hasDiscount = originalPrice > unitPrice;
  const imageUrl = product?.urlImage;

  const displayPublisher = formatFieldText(product?.publisher);
  const displaySeries = product?.series ? formatFieldText(product.series) : null;
  const displayAuthors = formatArrayText(product?.authors).join(", ");
  const displayGenres = formatArrayText(product?.genres);

  return (
    <div className="group card-custom-v1 py-4 transition-all duration-200 border-slate-200/60 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* 💻 1. Giao diện Desktop (lg trở lên) */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_120px_120px_120px] lg:items-center px-4">
        {/* Cột 1: Hình ảnh & Thông tin chi tiết sản phẩm */}
        <div className="flex items-center gap-4 min-w-0 pl-2">
          <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 shadow-sm">
            <img
              src={imageUrl}
              alt={product?.name}
              className="h-[100px] w-[72px] object-cover"
            />
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            <Link to={`/product?slug=${product?.slug}`}>
              <h3 className="font-bold text-slate-900 line-clamp-2 text-sm md:text-base leading-snug hover:text-blue-600 transition cursor-pointer">
                {product?.name}
              </h3>
            </Link>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                showDetails
                  ? "grid-rows-[1fr] opacity-100 mt-1.5"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-1 pb-1">
                  {/* Publisher & Series */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {displayPublisher && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100/50">
                        <Building2 size={10} />
                        <span>{displayPublisher}</span>
                      </div>
                    )}
                    {displaySeries && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-medium border border-purple-100/50">
                        <Bookmark size={10} />
                        <span>{displaySeries}</span>
                      </div>
                    )}
                  </div>
                  {/* Authors */}
                  {displayAuthors && (
                    <div className="flex flex-wrap items-center gap-1">
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-50/70 text-amber-700 border border-amber-200/60">
                        <User size={10} />
                        <span>{displayAuthors}</span>
                      </div>
                    </div>
                  )}
                  {/* Genres */}
                  {displayGenres && displayGenres.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      {displayGenres.map((genre, index) => (
                        <div
                          key={genre || index}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${
                            index === 0
                              ? "bg-indigo-50/50 text-indigo-600 border-indigo-100/50"
                              : "bg-slate-50/80 text-slate-500 border-slate-200/80"
                          }`}
                        >
                          {index === 0 ? <BookOpen size={10} /> : <Tag size={10} />}
                          <span>{genre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-400">
                    {product?.publishYear && (
                      <div className="flex items-center gap-1">
                        <Calendar size={10} className="text-slate-300" />
                        <span>{product.publishYear}</span>
                      </div>
                    )}
                    {product?.pages > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText size={10} className="text-slate-300" />
                        <span>{product.pages} trang</span>
                      </div>
                    )}
                    {product?.weight > 0 && (
                      <div className="flex items-center gap-1">
                        <Weight size={10} className="text-slate-300" />
                        <span>{product.weight}g</span>
                      </div>
                    )}
                    {product?.language && (
                      <div className="flex items-center gap-1">
                        <Languages size={10} className="text-slate-300" />
                        <span>{getLanguageName(product.language)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDetails(!showDetails);
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition cursor-pointer"
              >
                {showDetails ? "Thu gọn" : "Xem thêm chi tiết"}
                {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Cột 2: Đơn giá */}
        <div className="text-right pr-2">
          {hasDiscount && (
            <p className="text-xs text-slate-400 line-through tabular-nums">
              {formatMoney(originalPrice)}
            </p>
          )}
          <p className="text-sm text-slate-900 font-bold tabular-nums mt-0.5">
            {formatMoney(unitPrice)}
          </p>
        </div>

        {/* Cột 3: Số lượng */}
        <div className="flex justify-center">
          <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
            x{item.quantity}
          </span>
        </div>

        {/* Cột 4: Thành tiền */}
        <div className="text-right pr-2">
          <p className="text-sm font-bold text-red-600 tabular-nums">
            {formatMoney(unitPrice * item.quantity)}
          </p>
        </div>
      </div>

      {/* 📟 2. Giao diện Tablet (sm đến md) */}
      <div className="hidden sm:grid lg:hidden sm:grid-cols-[1fr_auto_auto] sm:items-center gap-5 p-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-200/60 bg-slate-50 shadow-sm">
            <img
              src={imageUrl}
              alt={product?.name}
              className="h-24 w-16 object-cover"
            />
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            <Link to={`/product?slug=${product?.slug}`}>
              <h3 className="font-bold text-slate-900 line-clamp-2 text-sm md:text-base leading-snug hover:text-blue-600 transition cursor-pointer">
                {product?.name}
              </h3>
            </Link>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                showDetails
                  ? "grid-rows-[1fr] opacity-100 mt-1.5"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-1 pb-1">
                  {/* Publisher & Series */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {displayPublisher && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100/50">
                        <Building2 size={10} />
                        <span>{displayPublisher}</span>
                      </div>
                    )}
                    {displaySeries && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-medium border border-purple-100/50">
                        <Bookmark size={10} />
                        <span>{displaySeries}</span>
                      </div>
                    )}
                  </div>
                  {/* Authors */}
                  {displayAuthors && (
                    <div className="flex flex-wrap items-center gap-1">
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-50/70 text-amber-700 border border-amber-200/60">
                        <User size={10} />
                        <span>{displayAuthors}</span>
                      </div>
                    </div>
                  )}
                  {/* Genres */}
                  {displayGenres && displayGenres.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      {displayGenres.map((genre, index) => (
                        <div
                          key={genre || index}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${
                            index === 0
                              ? "bg-indigo-50/50 text-indigo-600 border-indigo-100/50"
                              : "bg-slate-50/80 text-slate-500 border-slate-200/80"
                          }`}
                        >
                          {index === 0 ? <BookOpen size={10} /> : <Tag size={10} />}
                          <span>{genre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-400">
                    {product?.publishYear && (
                      <div className="flex items-center gap-1">
                        <Calendar size={10} className="text-slate-300" />
                        <span>{product.publishYear}</span>
                      </div>
                    )}
                    {product?.pages > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText size={10} className="text-slate-300" />
                        <span>{product.pages} trang</span>
                      </div>
                    )}
                    {product?.weight > 0 && (
                      <div className="flex items-center gap-1">
                        <Weight size={10} className="text-slate-300" />
                        <span>{product.weight}g</span>
                      </div>
                    )}
                    {product?.language && (
                      <div className="flex items-center gap-1">
                        <Languages size={10} className="text-slate-300" />
                        <span>{getLanguageName(product.language)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDetails(!showDetails);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 transition cursor-pointer"
              >
                {showDetails ? "Thu gọn" : "Xem thêm chi tiết"}
                {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center px-2">
          <span className="text-sm font-semibold text-slate-900">
            x{item.quantity}
          </span>
        </div>

        <div className="text-right min-w-[120px]">
          {hasDiscount && (
            <p className="text-xs text-slate-400 line-through">
              {formatMoney(originalPrice)}
            </p>
          )}
          <p className="text-xs font-medium text-slate-500">
            {formatMoney(unitPrice)}
          </p>
          <p className="text-sm font-bold text-red-600 mt-1">
            {formatMoney(unitPrice * item.quantity)}
          </p>
        </div>
      </div>

      {/* 📱 3. Giao diện Mobile */}
      <div className="sm:hidden p-2 space-y-3">
        <div className="flex gap-3">
          <div className="relative shrink-0 overflow-hidden rounded-lg border border-slate-200/60 bg-slate-50 shadow-sm">
            <img
              src={imageUrl}
              alt={product?.name}
              className="h-20 w-14 object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <Link to={`/product?slug=${product?.slug}`}>
              <h3 className="font-bold text-slate-900 line-clamp-2 text-xs hover:text-blue-600 transition cursor-pointer">
                {product?.name}
              </h3>
            </Link>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                showDetails
                  ? "grid-rows-[1fr] opacity-100 mt-1.5"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-1 pb-1">
                  {/* Publisher & Series */}
                  <div className="flex flex-wrap items-center gap-1">
                    {displayPublisher && (
                      <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-medium border border-emerald-100/50">
                        <Building2 size={8} />
                        <span>{displayPublisher}</span>
                      </div>
                    )}
                    {displaySeries && (
                      <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[9px] font-medium border border-purple-100/50">
                        <Bookmark size={8} />
                        <span>{displaySeries}</span>
                      </div>
                    )}
                  </div>
                  {/* Authors */}
                  {displayAuthors && (
                    <div className="flex flex-wrap items-center gap-1">
                      <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-medium bg-amber-50/70 text-amber-700 border border-amber-200/60">
                        <User size={8} />
                        <span>{displayAuthors}</span>
                      </div>
                    </div>
                  )}
                  {/* Genres */}
                  {displayGenres && displayGenres.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      {displayGenres.map((genre, index) => (
                        <div
                          key={genre || index}
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[9px] font-medium border ${
                            index === 0
                              ? "bg-indigo-50/50 text-indigo-600 border-indigo-100/50"
                              : "bg-slate-50/80 text-slate-500 border-slate-200/80"
                          }`}
                        >
                          {index === 0 ? <BookOpen size={8} /> : <Tag size={8} />}
                          <span>{genre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-slate-400">
                    {product?.publishYear && (
                      <div className="flex items-center gap-0.5">
                        <Calendar size={8} className="text-slate-300" />
                        <span>{product.publishYear}</span>
                      </div>
                    )}
                    {product?.pages > 0 && (
                      <div className="flex items-center gap-0.5">
                        <FileText size={8} className="text-slate-300" />
                        <span>{product.pages} trang</span>
                      </div>
                    )}
                    {product?.weight > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Weight size={8} className="text-slate-300" />
                        <span>{product.weight}g</span>
                      </div>
                    )}
                    {product?.language && (
                      <div className="flex items-center gap-0.5">
                        <Languages size={8} className="text-slate-300" />
                        <span>{getLanguageName(product.language)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-0.5 flex items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDetails(!showDetails);
                }}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-blue-600 transition cursor-pointer"
              >
                {showDetails ? "Thu gọn" : "Xem thêm chi tiết"}
                {showDetails ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            </div>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
              <span className="text-xs font-bold text-slate-900">
                {formatMoney(unitPrice)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-slate-400 line-through">
                  {formatMoney(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Số lượng: <strong className="text-slate-900">x{item.quantity}</strong>
          </span>
          <p className="text-sm font-bold text-red-600">
            {formatMoney(unitPrice * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
