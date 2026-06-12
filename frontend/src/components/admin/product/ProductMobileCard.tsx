import type { ProductResponse } from "@/types/product.type";
import { SearchX, BookOpen, Calendar, FileText, Weight, Building2, Layers } from "lucide-react";
import ProductStatusBadge from "./ProductStatusBadge";
import ProductActionButtons from "./ProductActionButtons";
import { ExpandableAuthors, ExpandableGenres } from "./ProductTable";

type Props = {
  products: ProductResponse[];
  onDelete: (product: ProductResponse) => void;
};

const ProductMobileCard = ({ products, onDelete }: Props) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const discountPercent = (original: number, price: number) => {
    if (!original || original <= price) return 0;
    return Math.round(((original - price) / original) * 100);
  };

  return (
    <div className="space-y-4 md:hidden">
      {products && products.length > 0 ? (
        products.map((product) => {
          const discount = discountPercent(product.originalPrice, product.price);
          return (
            <div key={product.id} className="card-custom space-y-3">

              {/* ===== HEADER: Ảnh + Tên + Badge ===== */}
              <div className="flex items-start gap-3">
                {product.urlImageDefault ? (
                  <img
                    src={product.urlImageDefault}
                    alt={product.name}
                    className="w-14 h-[76px] rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-14 h-[76px] rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                    <BookOpen size={18} className="text-slate-300" />
                  </div>
                )}

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="font-bold text-slate-900 text-sm leading-snug line-clamp-2"
                      title={product.name}
                    >
                      {product.name}
                    </span>
                    <div className="shrink-0">
                      <ProductStatusBadge
                        status={product.quantity > 0 ? "ACTIVE" : "INACTIVE"}
                      />
                    </div>
                  </div>

                  {product.isbn && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {product.isbn}
                    </span>
                  )}
                  {(product.publisherName || product.seriesName) && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
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
                </div>
              </div>

              {/* ===== TÁC GIẢ + THỂ LOẠI ===== */}
              {((product.productAuthors && product.productAuthors.length > 0) || (product.productGenres && product.productGenres.length > 0)) && (
                <div className="flex flex-wrap gap-1">
                  <ExpandableAuthors authors={product.productAuthors} limit={2} />
                  <ExpandableGenres genres={product.productGenres} limit={2} />
                </div>
              )}

              {/* ===== THÔNG TIN XUẤT BẢN ===== */}
              {(product.publishYear || product.pages > 0 || product.weight > 0) && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                  {product.publishYear && (
                    <div className="flex items-center gap-1">
                      <Calendar size={11} className="text-slate-400" />
                      <span>{product.publishYear}</span>
                    </div>
                  )}
                  {product.pages > 0 && (
                    <div className="flex items-center gap-1">
                      <FileText size={11} className="text-slate-400" />
                      <span>{product.pages} trang</span>
                    </div>
                  )}
                  {product.weight > 0 && (
                    <div className="flex items-center gap-1">
                      <Weight size={11} className="text-slate-400" />
                      <span>{product.weight}g</span>
                    </div>
                  )}
                </div>
              )}

              {/* ===== GIÁ & TỒN KHO ===== */}
              <div className="grid grid-cols-2 gap-2 border-y border-slate-100 py-2.5 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Giá bán:</span>
                  <span className="text-indigo-600 font-bold text-sm">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-slate-400 line-through text-[11px]">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Tồn kho:</span>
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
                    <span className="block text-[10px] text-rose-500 mt-0.5">
                      Hết hàng
                    </span>
                  )}
                  {product.quantity > 0 && product.quantity <= 10 && (
                    <span className="block text-[10px] text-amber-500 mt-0.5">
                      Sắp hết
                    </span>
                  )}
                </div>
              </div>

              {/* ===== ACTIONS ===== */}
              <ProductActionButtons item={product} onDelete={onDelete} mobile />
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-2">
            <SearchX size={32} strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium text-slate-600">
            Không tìm thấy sản phẩm nào
          </span>
          <p className="text-xs text-slate-400 max-w-60 mt-1 leading-relaxed">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc xem sao nhé.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductMobileCard;
