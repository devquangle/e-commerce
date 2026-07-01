import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Building2,
  Layers,
  Calendar,
  FileText,
  Weight,
  Languages,
  SearchX,
  Loader2,
} from "lucide-react";
import Pagination from "@/components/common/Pagination";
import type {
  ProductDetailResponse,
  ProductResponse,
} from "@/modules/admin/product/types/product.type";
import { useFilterProduct } from "@/modules/admin/product/hooks/useProduct";
import useProductFilter from "@/modules/admin/product/hooks/useProductFilter";
import { useQueries } from "@tanstack/react-query";
import ProductService from "@/modules/admin/product/services/product.service";
import useDebounce from "@/hooks/useDebounce";
import { registerLocale, getName } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";
import { formatMoney } from "@/utils/number.utils";

registerLocale(viLocale);

const getLanguageName = (code?: string) => {
  if (!code) return "";
  const name = getName(code, "vi");
  if (!name) return code;
  return name.charAt(0).toUpperCase() + name.slice(1);
};

import type { PromotionProductResponse, PromotionCampaignType } from "../types/promotion.type";
import { campaignTypeLabels } from "../types/promotion.type";

export interface ProductSelectorItem extends ProductResponse {
  importPrice: number;
}

interface PromotionProductSelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  onProductsDataChange?: (products: PromotionProductResponse[]) => void;
  initialProducts?: PromotionProductResponse[];
  promoStartDate?: string;
  promoEndDate?: string;
  currentPromotionId?: number;
}

const PromotionProductSelector: React.FC<PromotionProductSelectorProps> = ({
  selectedIds,
  onChange,
  onProductsDataChange,
  initialProducts,
  promoStartDate,
  promoEndDate,
  currentPromotionId,
}) => {
  // SỬ DỤNG HOOK USEPRODUCTFILTER CHUẨN HOÁ
  const {
    keyword,
    page,
    size,
    debouncedKeyword,
    setPage,
    setSize,
    handleKeywordChange,
  } = useProductFilter();

  // SỬ DỤNG HOOK USEFILTERPRODUCT ĐỂ LẤY DỮ LIỆU SẢN PHẨM PHÂN TRANG TỪ SERVER
  const { data: productPagination, isLoading: isFilterLoading } =
    useFilterProduct({
      keyword: debouncedKeyword || undefined,
      page,
      size: size || 10,
      status: "ACTIVE"
    });

  // Lấy chi tiết các sản phẩm được chọn bằng useQueries (không dùng useProduct)
  const selectedProductQueries = useQueries({
    queries: selectedIds.map((id) => ({
      queryKey: ["product", id],
      queryFn: () => ProductService.getById(id),
      enabled: !!id,
    })),
  });

  const selectedProductsDetails = useMemo(() => {
    return selectedProductQueries
      .map((q) => q.data)
      .filter((data): data is ProductDetailResponse => !!data)
      .map((d): ProductResponse => {
        const thumbnail =
          d.coverImages?.find((img) => img.isThumbnail)?.url || "";
        return {
          id: d.id,
          name: d.name,
          slug: d.slug,
          originalPrice: d.originalPrice,
          price: d.price,
          quantity: d.quantity,
          weight: d.weight,
          publishYear: d.publishYear,
          pages: d.pages,
          language: d.language,
          status: d.status,
          genresName: [],
          authorsName: [],
          publisherName: "",
          seriesName: "",
          urlImageDefault: thumbnail || (d.coverImages?.[0]?.url ?? ""),
          promotions: d.promotions,
        };
      });
  }, [selectedProductQueries]);

  const isDetailsLoading = useMemo(() => {
    return selectedProductQueries.some((q) => q.isLoading);
  }, [selectedProductQueries]);

  const isLoading = isFilterLoading || isDetailsLoading;

  const [discountsMap, setDiscountsMap] = useState<Record<number, number>>(
    () => {
      const discounts: Record<number, number> = {};
      if (initialProducts) {
        initialProducts.forEach((p) => {
          discounts[p.productId] = p.localDiscount;
        });
      }
      return discounts;
    },
  );

  const [promoQuantities, setPromoQuantities] = useState<
    Record<number, number>
  >(() => {
    const quantities: Record<number, number> = {};
    if (initialProducts) {
      initialProducts.forEach((p) => {
        quantities[p.productId] = p.localQty;
      });
    }
    return quantities;
  });

  const [prevInitialProducts, setPrevInitialProducts] =
    useState(initialProducts);

  if (initialProducts !== prevInitialProducts) {
    setPrevInitialProducts(initialProducts);
    const discounts: Record<number, number> = {};
    const quantities: Record<number, number> = {};
    if (initialProducts) {
      initialProducts.forEach((p) => {
        discounts[p.productId] = p.localDiscount;
        quantities[p.productId] = p.localQty;
      });
    }
    setDiscountsMap(discounts);
    setPromoQuantities(quantities);
  }

  useEffect(() => {
    if (onProductsDataChange) {
      const data: PromotionProductResponse[] = selectedIds.map((id) => {
        const discount = discountsMap[id] ?? 10;
        const qty = promoQuantities[id] ?? 10;
        return {
          productId: id,
          localDiscount: discount,
          localQty: qty,
        };
      });
      onProductsDataChange(data);
    }
  }, [selectedIds, discountsMap, promoQuantities, onProductsDataChange]);

  // Lấy các sản phẩm phân trang từ Server
  const serverItems = useMemo(() => {
    return productPagination?.items || [];
  }, [productPagination]);

  // Tìm các sản phẩm được chọn nhưng không có trên trang hiện tại để chèn lên đầu
  const prependedItems = useMemo(() => {
    if (selectedIds.length === 0) return [];

    const serverItemIds = new Set(serverItems.map((item) => item.id));
    const missingIds = selectedIds.filter((id) => !serverItemIds.has(id));

    let missingProducts = selectedProductsDetails.filter((p) =>
      missingIds.includes(p.id),
    );

    // Lọc theo từ khóa tìm kiếm nếu có
    if (debouncedKeyword) {
      const kw = debouncedKeyword.toLowerCase();
      missingProducts = missingProducts.filter((p) =>
        p.name.toLowerCase().includes(kw),
      );
    }

    return missingProducts;
  }, [selectedProductsDetails, selectedIds, serverItems, debouncedKeyword]);

  // Kết hợp danh sách sản phẩm: Sản phẩm chọn từ trang khác lên đầu, sản phẩm trang hiện tại ở sau
  const productsList: ProductSelectorItem[] = useMemo(() => {
    const combined = [...prependedItems, ...serverItems];
    return combined.map((p) => ({
      ...p,
      importPrice: p.originalPrice,
    }));
  }, [prependedItems, serverItems]);

  const totalPages = productPagination?.totalPages || 1;
  const totalItems = productPagination?.totalItems || 0;

  const isAllPaginatedSelected = useMemo(() => {
    if (productsList.length === 0) return false;
    return productsList.every((p) => selectedIds.includes(p.id));
  }, [productsList, selectedIds]);

  const handleToggleSelectAll = () => {
    if (isAllPaginatedSelected) {
      const paginatedIds = productsList.map((p) => p.id);
      onChange(selectedIds.filter((id) => !paginatedIds.includes(id)));
    } else {
      const newIds = Array.from(
        new Set([...selectedIds, ...productsList.map((p) => p.id)]),
      );
      onChange(newIds);
    }
  };

  const handleToggleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleDiscountChange = useCallback((id: number, val: number) => {
    setDiscountsMap((prev) => {
      if (prev[id] === val) return prev;
      return {
        ...prev,
        [id]: val,
      };
    });
  }, []);

  const handleQuantityChange = useCallback(
    (id: number, val: number) => {
      const product = productsList.find((p) => p.id === id);
      const maxStock = product ? product.quantity : 0;
      const safeVal = isNaN(val)
        ? 0
        : val < 0
          ? 0
          : val > maxStock
            ? maxStock
            : val;
      setPromoQuantities((prev) => {
        if (prev[id] === safeVal) return prev;
        return {
          ...prev,
          [id]: safeVal,
        };
      });
    },
    [productsList],
  );

  return (
    <div className="card-custom space-y-5">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
              Sản phẩm áp dụng chương trình
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold">
                <CheckCircle2 size={12} />
                Đã chọn {selectedIds.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tích chọn sản phẩm, nhập mức giảm giá (%) và số lượng áp dụng cho
              từng sản phẩm
            </p>
          </div>
        </div>

        {/* SEARCH BAR — KẾT NỐI VỚI USEPRODUCTFILTER */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên sách hoặc tác giả..."
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 shadow-2xs"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-indigo-600" size={28} />
          </div>
        )}
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500">
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllPaginatedSelected}
                  onChange={handleToggleSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider min-w-[340px]">
                Thông tin sản phẩm
              </th>
              <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider w-72">
                Thông tin giá & Giảm giá
              </th>
              <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider w-40 text-right">
                Số lượng
              </th>
              <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider w-72 text-left">
                Chương trình đã tham gia
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {productsList.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <div className="p-3 bg-slate-50 rounded-full mb-1 animate-pulse">
                      <SearchX size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Không tìm thấy sản phẩm nào
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              productsList.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isSelected={selectedIds.includes(product.id)}
                  initialDiscount={discountsMap[product.id] ?? 10}
                  initialPromoQty={promoQuantities[product.id] ?? 10}
                  onToggleSelect={() => handleToggleSelectOne(product.id)}
                  onDiscountChange={(val) =>
                    handleDiscountChange(product.id, val)
                  }
                  onQuantityChange={(val) =>
                    handleQuantityChange(product.id, val)
                  }
                  promoStartDate={promoStartDate}
                  promoEndDate={promoEndDate}
                  currentPromotionId={currentPromotionId}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION — KẾT NỐI VỚI USEPRODUCTFILTER & USEFILTERPRODUCT */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={totalItems}
        pageSize={size}
        onPageSizeChange={(s) => {
          setSize(s);
          setPage(1);
        }}
      />
    </div>
  );
};

// ─── SUB-COMPONENT PRODUCTROW VỚI DEBOUNCE VÀ HIGH CONTRAST INPUTS ──────
interface ProductRowProps {
  product: ProductSelectorItem;
  isSelected: boolean;
  initialDiscount: number;
  initialPromoQty: number;
  onToggleSelect: () => void;
  onDiscountChange: (val: number) => void;
  onQuantityChange: (val: number) => void;
  promoStartDate?: string;
  promoEndDate?: string;
  currentPromotionId?: number;
}

const isOverlapping = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
) => {
  if (!start1 || !end1 || !start2 || !end2) return false;
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  return !(e1 < s2 || s1 > e2);
};

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  isSelected,
  initialDiscount,
  initialPromoQty,
  onToggleSelect,
  onDiscountChange,
  onQuantityChange,
  promoStartDate,
  promoEndDate,
  currentPromotionId,
}) => {
  const [localDiscount, setLocalDiscount] = useState<string>(
    initialDiscount.toString(),
  );
  const [localQty, setLocalQty] = useState<string>(initialPromoQty.toString());

  const debouncedDiscountStr = useDebounce(localDiscount, 300);
  const debouncedQtyStr = useDebounce(localQty, 300);

  useEffect(() => {
    setLocalDiscount(initialDiscount.toString());
  }, [initialDiscount]);

  useEffect(() => {
    setLocalQty(initialPromoQty.toString());
  }, [initialPromoQty]);

  const handleQtyInputChange = (valStr: string) => {
    const num = parseInt(valStr, 10);
    if (!isNaN(num) && num > product.quantity) {
      setLocalQty(product.quantity.toString());
    } else {
      setLocalQty(valStr);
    }
  };

  const handleQtyBlur = () => {
    const num = parseInt(localQty, 10);
    if (isNaN(num) || num < 1) {
      setLocalQty("1");
    } else if (num > product.quantity) {
      setLocalQty(product.quantity.toString());
    }
  };

  const onDiscountChangeRef = useRef(onDiscountChange);
  const onQuantityChangeRef = useRef(onQuantityChange);

  const initialDiscountRef = useRef(initialDiscount);
  const initialPromoQtyRef = useRef(initialPromoQty);

  useEffect(() => {
    onDiscountChangeRef.current = onDiscountChange;
  }, [onDiscountChange]);

  useEffect(() => {
    onQuantityChangeRef.current = onQuantityChange;
  }, [onQuantityChange]);

  useEffect(() => {
    initialDiscountRef.current = initialDiscount;
  }, [initialDiscount]);

  useEffect(() => {
    initialPromoQtyRef.current = initialPromoQty;
  }, [initialPromoQty]);

  useEffect(() => {
    const num = parseFloat(debouncedDiscountStr);
    const safeVal = isNaN(num) ? 0 : num < 0 ? 0 : num > 100 ? 100 : num;
    if (safeVal !== initialDiscountRef.current) {
      onDiscountChangeRef.current(safeVal);
    }
  }, [debouncedDiscountStr]);

  useEffect(() => {
    const num = parseInt(debouncedQtyStr, 10);
    if (!isNaN(num) && num > product.quantity) {
      setLocalQty(product.quantity.toString());
    }
    const safeVal = isNaN(num)
      ? 0
      : num < 0
        ? 0
        : num > product.quantity
          ? product.quantity
          : num;
    if (safeVal !== initialPromoQtyRef.current) {
      onQuantityChangeRef.current(safeVal);
    }
  }, [debouncedQtyStr, product.quantity]);

  const currentDiscountNum = useMemo(() => {
    const num = parseFloat(localDiscount);
    return isNaN(num) ? 0 : num;
  }, [localDiscount]);

  const finalPrice = useMemo(() => {
    return Math.round(product.price * (1 - currentDiscountNum / 100));
  }, [product.price, currentDiscountNum]);

  const isSellAtLoss = finalPrice < product.importPrice;

  const hasOverlap = useMemo(() => {
    if (!promoStartDate || !promoEndDate || !product.promotions) return false;
    return product.promotions.some((promo) => {
      if (currentPromotionId && promo.id === currentPromotionId) {
        return false;
      }
      return isOverlapping(promoStartDate, promoEndDate, promo.startDate, promo.endDate);
    });
  }, [product.promotions, promoStartDate, promoEndDate, currentPromotionId]);

  const tdClass = (extra: string = "") => {
    const base = "py-5 px-4 align-middle transition-all duration-200";
    if (hasOverlap && isSelected) {
      return `${base} bg-rose-50/25 border-y border-red-300 first:border-l first:rounded-l-xl last:border-r last:rounded-r-xl ${extra}`;
    }
    return `${base} ${extra}`;
  };

  return (
    <tr
      onClick={onToggleSelect}
      className={`cursor-pointer transition-colors group ${
        isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/60"
      }`}
    >
      {/* CHECKBOX */}
      <td
        className={tdClass("text-center")}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </td>

      {/* THÔNG TIN SẢN PHẨM */}
      <td className={tdClass()}>
        <div className="flex gap-3.5 items-stretch">
          {/* Ảnh bìa */}
          <div className="shrink-0 mt-0.5">
            {product.urlImageDefault ? (
              <img
                src={product.urlImageDefault}
                alt={product.name}
                className="w-[72px] h-[104px] rounded-lg object-cover border border-slate-200 shadow-xs group-hover:shadow-md transition-shadow"
              />
            ) : (
              <div className="w-[72px] h-[104px] rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                <BookOpen size={20} className="text-slate-300" />
              </div>
            )}
          </div>

          {/* Nội dung chi tiết */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {/* Tên sách */}
            <div className="flex flex-col gap-0.5">
              <p
                className="font-bold text-slate-900 text-sm leading-snug line-clamp-2"
                title={product.name}
              >
                {product.name}
              </p>
            </div>

            {/* NXB + Series */}
            {(product.publisherName || product.seriesName) && (
              <div className="flex flex-wrap gap-1.5">
                {product.publisherName && (
                  <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-100/80 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                    <Building2 size={10} />
                    <span>{product.publisherName}</span>
                  </span>
                )}
                {product.seriesName && (
                  <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-100/80 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                    <Layers size={10} />
                    <span>{product.seriesName}</span>
                  </span>
                )}
              </div>
            )}

            {/* Tác giả + Thể loại */}
            <div className="flex flex-wrap gap-1.5">
              <ExpandableAuthors authors={product.authorsName} limit={3} />
              <ExpandableGenres genres={product.genresName} limit={3} />
            </div>

            {/* Thông số phụ */}
            {(product.publishYear ||
              product.pages > 0 ||
              product.weight > 0 ||
              product.language) && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400 font-medium">
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
                {product.language && (
                  <span className="flex items-center gap-1">
                    <Languages size={10} />
                    {getLanguageName(product.language)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* GIÁ & CHIẾT KHẤU / MỨC GIẢM */}
      <td className={tdClass()}>
        <div className="flex flex-col gap-2 justify-center min-h-11">
          {/* Hàng 1: Giá nhập & Giá bán */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px]">Nhập</span>
              <span className="font-medium">{formatMoney(product.importPrice)}</span>
            </div>
            <span className="text-slate-300 text-xs">|</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded text-[9px]">Bán</span>
              <span className="font-bold text-slate-700">{formatMoney(product.price)}</span>
            </div>
          </div>

          {/* Hàng 2: Mức giảm (%) & Giá cuối cùng */}
          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                disabled={!isSelected}
                value={localDiscount}
                onChange={(e) => setLocalDiscount(e.target.value)}
                className={`w-14 px-2 py-1 text-xs font-extrabold text-center rounded-lg border outline-none transition-all ${
                  isSelected
                    ? "border-slate-300 bg-white text-indigo-700 hover:border-indigo-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                    : "border-slate-200 bg-slate-100/80 text-slate-400 cursor-not-allowed"
                }`}
              />
              <span className="text-xs font-bold text-slate-500">%</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-xs font-medium">→</span>
              <span className="font-extrabold text-indigo-600 text-sm">
                {formatMoney(finalPrice)}
              </span>
              {isSellAtLoss && (
                <span
                  title="Cảnh báo: Giá bán cuối cùng đang thấp hơn giá nhập! Bạn có chắc chắn muốn tiếp tục?"
                  className="inline-flex items-center justify-center p-1 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors cursor-help"
                >
                  <AlertTriangle size={12} className="text-amber-600" />
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* SỐ LƯỢNG (TỒN KHO & ÁP DỤNG) */}
      <td
        className={tdClass("text-right")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1 items-end justify-center min-h-11">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <span>Tồn kho:</span>
            <span
              className={`font-bold ${
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
              <span className="text-[9px] text-rose-500 font-semibold bg-rose-50 px-1 py-0.2 rounded border border-rose-100">Hết</span>
            )}
            {product.quantity > 0 && product.quantity <= 10 && (
              <span className="text-[9px] text-amber-500 font-semibold bg-amber-50 px-1 py-0.2 rounded border border-amber-100">Sắp hết</span>
            )}
          </div>
          <input
            type="number"
            min={1}
            max={product.quantity}
            disabled={!isSelected}
            value={localQty}
            onChange={(e) => handleQtyInputChange(e.target.value)}
            onBlur={handleQtyBlur}
            className={`w-20 px-2 py-1 text-xs font-extrabold text-right rounded-lg border outline-none transition-all ${
              isSelected
                ? "border-slate-300 bg-white text-slate-900 shadow-2xs hover:border-indigo-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                : "border-slate-200 bg-slate-100/80 text-slate-400 cursor-not-allowed"
            }`}
          />
        </div>
      </td>

      {/* CHƯƠNG TRÌNH ĐANG THAM GIA */}
      <td className={tdClass("text-left")} onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-1.5 justify-center min-h-11 max-w-[280px]">
          {hasOverlap && isSelected && (
            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 px-2 py-1 rounded-lg text-[10px] font-bold mb-1.5 w-fit">
              <AlertTriangle size={12} className="text-rose-600" />
              <span>Trùng lịch chương trình khác!</span>
            </div>
          )}
          {product.promotions && product.promotions.length > 0 ? (
            product.promotions.map((promo, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 border-b border-slate-100/60 last:border-0 pb-1.5 last:pb-0">
                <div className="flex items-center gap-1 text-xs text-slate-800 font-semibold line-clamp-1" title={promo.name}>
                  <Tag size={10} className="text-indigo-500 shrink-0" />
                  <span>{promo.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500 font-medium">
                  <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md text-[9px] font-bold">
                    {campaignTypeLabels[promo.campaignType as PromotionCampaignType] || promo.campaignType}
                  </span>
                  <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-md text-[9px] font-bold">
                    -{promo.discountPercentage}%
                  </span>
                </div>
                <div className="text-[9px] text-slate-400 font-medium mt-0.5">
                  {promo.startDate} đến {promo.endDate}
                </div>
              </div>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">Chưa tham gia chương trình nào</span>
          )}
        </div>
      </td>
    </tr>
  );
};

// ─── COMPONENT HIỂN THỊ CHIPS TÁC GIẢ ────────────────────────
export const ExpandableAuthors = ({
  authors,
  limit,
}: {
  authors: string[];
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
      {visible.map((name, index) => (
        <span
          key={`a-${index}`}
          className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded text-[10px] font-medium"
        >
          <BookOpen size={10} />
          <span className="max-w-[100px] truncate" title={name}>
            {name}
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
          className="inline-flex items-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors font-semibold"
        >
          +{authors.length - limit} nữa
        </button>
      )}
      {hasMore && expanded && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded(false);
          }}
          className="inline-flex items-center text-indigo-600 hover:underline px-1 py-0.5 rounded text-[10px] cursor-pointer font-semibold"
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
  genres: string[];
  limit: number;
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!genres || genres.length === 0) return null;

  const visible = expanded ? genres : genres.slice(0, limit);
  const hasMore = genres.length > limit;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {visible.map((name, index) => (
        <span
          key={`g-${index}`}
          className="inline-flex items-center gap-1 bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-medium"
        >
          <Tag size={10} />
          <span className="max-w-[100px] truncate" title={name}>
            {name}
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
          className="inline-flex items-center bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors font-semibold"
        >
          +{genres.length - limit} nữa
        </button>
      )}
      {hasMore && expanded && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExpanded(false);
          }}
          className="inline-flex items-center text-slate-500 hover:underline px-1 py-0.5 rounded text-[10px] cursor-pointer font-semibold"
        >
          Thu gọn
        </button>
      )}
    </div>
  );
};

export default PromotionProductSelector;
