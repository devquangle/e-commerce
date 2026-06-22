import { useState } from "react";

import {
  SearchX,
  BookOpen,
  Tag,
  Calendar,
  FileText,
  Weight,
  Building2,
  Layers,
} from "lucide-react";
import ProductStatusBadge from "./ProductStatusBadge";
import ProductActionButtons from "./ProductActionButtons";
import type { ProductResponse } from "../types/product.type";

type Props = {
  products: ProductResponse[];
  onDelete: (product: ProductResponse) => void;
};

export default function ProductTable({ products, onDelete }: Props) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr className="text-slate-500">
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-10 text-center">
              STT
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider min-w-[400px]">
              Thông tin sản phẩm 
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-36">
              Giá nhập
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-36">
              Giá bán
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-24 text-center">
              Tồn kho
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-28">
              Trạng thái
            </th>
            <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right w-28">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {products && products.length > 0 ? (
            products.map((product, index) => (
              <tr
                key={product.id}
                className="hover:bg-indigo-50/20 transition-colors group"
              >
                {/* ── STT ── */}
                <td className="py-4 px-4 text-slate-400 font-medium text-center align-middle text-xs">
                  {index + 1}
                </td>

                {/* ── THÔNG TIN SẢN PHẨM CHUNG ── */}
                <td className="py-3 px-4 align-middle">
                  <div className="flex gap-3 items-stretch">
                    {/* Ảnh bìa — kích thước cố định */}
                    <div className="shrink-0 mt-0.5">
                      {product.urlImageDefault ? (
                        <img
                          src={product.urlImageDefault}
                          alt={product.name}
                          className="w-[72px] h-[104px] rounded object-cover border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow"
                        />
                      ) : (
                        <div className="w-[72px] h-[104px] rounded border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                          <BookOpen size={20} className="text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Nội dung 3 nhóm */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      {/* ➊ Tên + ISBN */}
                      <div className="flex flex-col gap-0.5">
                        <p
                          className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2"
                          title={product.name}
                        >
                          {product.name}
                        </p>
                        {product.isbn && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            {product.isbn}
                          </span>
                        )}
                      </div>

                      {/* NXB + Series */}
                      {(product.publisherName || product.seriesName) && (
                        <div className="flex flex-wrap gap-1">
                          {product.publisherName && (
                            <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                              <Building2 size={10} />
                              <span>{product.publisherName}</span>
                            </span>
                          )}
                          {product.seriesName && (
                            <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                              <Layers size={10} />
                              <span>{product.seriesName}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tác giả + Thể loại */}
                      <div className="flex flex-wrap gap-1">
                        <ExpandableAuthors
                          authors={product.productAuthors}
                          limit={3}
                        />
                        <ExpandableGenres
                          genres={product.productGenres}
                          limit={3}
                        />
                      </div>

                      {/* ➌ Năm XB · Số trang · Trọng lượng */}
                      {(product.publishYear ||
                        product.pages > 0 ||
                        product.weight > 0) && (
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
                          {product.publishYear && (
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              {product.publishYear}
                            </span>
                          )}
                          {product.pages > 0 && (
                            <span className="flex items-center gap-1">
                              <FileText size={10} />
                              {product.pages} trang
                            </span>
                          )}
                          {product.weight > 0 && (
                            <span className="flex items-center gap-1">
                              <Weight size={10} />
                              {product.weight}g
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* ── GIÁ NHẬP ── */}
                <td className="py-4 px-4 align-middle">
                  <span className="text-sm text-slate-600 font-medium">
                    {formatPrice(product.originalPrice)}
                  </span>
                </td>

                {/* ── GIÁ BÁN ── */}
                <td className="py-4 px-4 align-middle">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-indigo-600 text-sm">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[11px] text-rose-500 font-semibold">
                        -
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100,
                        )}
                        %
                      </span>
                    )}
                  </div>
                </td>

                {/* ── TỒN KHO ── */}
                <td className="py-4 px-4 align-middle text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={`font-bold text-sm ${
                        product.quantity === 0
                          ? "text-rose-600"
                          : product.quantity <= 10
                            ? "text-amber-600"
                            : "text-slate-700"
                      }`}
                    >
                      {product.quantity}
                    </span>
                    {product.quantity === 0 && (
                      <span className="text-[10px] text-rose-500 font-medium">
                        Hết hàng
                      </span>
                    )}
                    {product.quantity > 0 && product.quantity <= 10 && (
                      <span className="text-[10px] text-amber-500 font-medium">
                        Sắp hết
                      </span>
                    )}
                  </div>
                </td>

                {/* ── TRẠNG THÁI ── */}
                <td className="py-4 px-4 align-middle">
                  <ProductStatusBadge
                    status={product.quantity > 0 ? "ACTIVE" : "INACTIVE"}
                  />
                </td>

                {/* ── THAO TÁC ── */}
                <td className="py-4 px-4 text-right align-middle">
                  <ProductActionButtons item={product} onDelete={onDelete} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="py-14 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                  <div className="p-3 bg-slate-50 rounded-full mb-1 animate-pulse">
                    <SearchX size={32} strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Không tìm thấy sản phẩm nào
                  </span>
                  <p className="text-xs max-w-[200px] leading-relaxed">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc xem sao nhé.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── COMPONENT HIỂN THỊ CHIPS TÁC GIẢ ────────────────────────
export const ExpandableAuthors = ({
  authors,
  limit,
}: {
  authors: ProductResponse["productAuthors"];
  limit: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!authors || authors.length === 0) {
    return (
      <span className="text-[10px] text-slate-400 italic">Chưa có tác giả</span>
    );
  }

  const visible = expanded ? authors : authors.slice(0, limit);
  const hasMore = authors.length > limit;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {visible.map((a) => (
        <span
          key={`a-${a.id}`}
          className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded text-[10px]"
        >
          <BookOpen size={10} />
          <span className="max-w-[100px] truncate" title={a.name}>
            {a.name}
          </span>
        </span>
      ))}
      {hasMore && !expanded && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded(true);
          }}
          className="inline-flex items-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors font-medium"
        >
          +{authors.length - limit} nữa
        </button>
      )}
      {hasMore && expanded && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpanded(false); }}
          className="inline-flex items-center text-indigo-600 hover:underline px-1 py-0.5 rounded text-[10px] cursor-pointer font-medium"
        >
          Thu gọn
        </button>
      )}
    </div>
  );
};

// ─── COMPONENT HIỂN THỊ CHIPS THỂ LOẠI ───────────────────────
export const ExpandableGenres = ({
  genres,
  limit,
}: {
  genres: ProductResponse["productGenres"];
  limit: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!genres || genres.length === 0) return null;

  const visible = expanded ? genres : genres.slice(0, limit);
  const hasMore = genres.length > limit;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {visible.map((g) => (
        <span
          key={`g-${g.id}`}
          className="inline-flex items-center gap-1 bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded text-[10px]"
        >
          <Tag size={10} />
          <span className="max-w-[100px] truncate" title={g.name}>
            {g.name}
          </span>
        </span>
      ))}
      {hasMore && !expanded && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded(true);
          }}
          className="inline-flex items-center bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors font-medium"
        >
          +{genres.length - limit} nữa
        </button>
      )}
      {hasMore && expanded && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpanded(false); }}
          className="inline-flex items-center text-slate-500 hover:underline px-1 py-0.5 rounded text-[10px] cursor-pointer font-medium"
        >
          Thu gọn
        </button>
      )}
    </div>
  );
};