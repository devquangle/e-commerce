import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
} from "lucide-react";
import Pagination from "@/components/common/Pagination";
import type { ProductResponse } from "@/modules/admin/product/types/product.type";
import useDebounce from "@/hooks/useDebounce";
import { registerLocale, getName } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";

registerLocale(viLocale);

const getLanguageName = (code?: string) => {
  if (!code) return "";
  const name = getName(code, "vi");
  if (!name) return code;
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export interface ProductSelectorItem extends ProductResponse {
  importPrice: number;
}

const dummyProducts: ProductSelectorItem[] = [
  {
    id: 101,
    name: "Đắc Nhân Tâm (Bìa Cứng)",
    slug: "dac-nhan-tam",
    originalPrice: 120000,
    price: 96000,
    importPrice: 75000,
    quantity: 150,
    weight: 400,
    publishYear: "2023",
    pages: 320,
    language: "en",
    status: "ACTIVE",
    genresName: ["Kỹ năng sống", "Tâm lý"],
    authorsName: ["Dale Carnegie"],
    publisherName: "NXB Tổng Hợp TPHCM",
    seriesName: "Tủ Sách Chữa Lành",
    urlImageDefault: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 102,
    name: "Nhà Giả Kim (Tái bản 2024)",
    slug: "nha-gia-kim",
    originalPrice: 89000,
    price: 79000,
    importPrice: 65000,
    quantity: 230,
    weight: 250,
    publishYear: "2024",
    pages: 225,
    language: "es",
    status: "ACTIVE",
    genresName: ["Văn học", "Tiểu thuyết"],
    authorsName: ["Paulo Coelho"],
    publisherName: "NXB Hội Nhà Văn",
    seriesName: "Sách Bán Chạy",
    urlImageDefault: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 103,
    name: "Tuổi Trẻ Đáng Giá Bao Nhiêu?",
    slug: "tuoi-tre-dang-gia-bao-nhieu",
    originalPrice: 90000,
    price: 72000,
    importPrice: 60000,
    quantity: 85,
    weight: 300,
    publishYear: "2022",
    pages: 280,
    language: "vi",
    status: "ACTIVE",
    genresName: ["Kỹ năng sống"],
    authorsName: ["Rosie Nguyễn"],
    publisherName: "NXB Nhã Nam",
    seriesName: "Cảm Hứng Sống",
    urlImageDefault: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 104,
    name: "Cây Cam Ngọt Của Tôi",
    slug: "cay-cam-ngot-cua-toi",
    originalPrice: 108000,
    price: 90000,
    importPrice: 70000,
    quantity: 310,
    weight: 320,
    publishYear: "2023",
    pages: 244,
    language: "pt",
    status: "ACTIVE",
    genresName: ["Văn học nước ngoài"],
    authorsName: ["José Mauro de Vasconcelos"],
    publisherName: "NXB Hội Nhà Văn",
    seriesName: "Kinh Điển thế giới",
    urlImageDefault: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 105,
    name: "Hạt Giống Tâm Hồn - Tập 1",
    slug: "hat-giong-tam-hon-1",
    originalPrice: 65000,
    price: 52000,
    importPrice: 50000,
    quantity: 45,
    weight: 200,
    publishYear: "2021",
    pages: 180,
    language: "vi",
    status: "ACTIVE",
    genresName: ["Hạt giống tâm hồn"],
    authorsName: ["Nhiều tác giả"],
    publisherName: "NXB First News",
    seriesName: "Hạt Giống Tâm Hồn",
    urlImageDefault: "https://images.unsplash.com/photo-1532012164546-f43249488629?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 106,
    name: "Tâm Lý Học Về Tiền",
    slug: "tam-ly-hoc-ve-tien",
    originalPrice: 180000,
    price: 144000,
    importPrice: 120000,
    quantity: 120,
    weight: 420,
    publishYear: "2023",
    pages: 350,
    language: "en",
    status: "ACTIVE",
    genresName: ["Kinh tế", "Tài chính"],
    authorsName: ["Morgan Housel"],
    publisherName: "NXB 139",
    seriesName: "Tài Chính Thông Minh",
    urlImageDefault: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 107,
    name: "Tư Duy Nhanh Và Chậm",
    slug: "tu-duy-nhanh-va-cham",
    originalPrice: 240000,
    price: 192000,
    importPrice: 160000,
    quantity: 95,
    weight: 550,
    publishYear: "2022",
    pages: 610,
    language: "en",
    status: "ACTIVE",
    genresName: ["Tâm lý học"],
    authorsName: ["Daniel Kahneman"],
    publisherName: "NXB Thế Giới",
    seriesName: "Tri Thức Tương Lai",
    urlImageDefault: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=150&auto=format&fit=crop&q=80",
  },
];

interface PromotionProductSelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

const PromotionProductSelector: React.FC<PromotionProductSelectorProps> = ({
  selectedIds,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [discountsMap, setDiscountsMap] = useState<Record<number, number>>({
    101: 10,
    102: 10,
    103: 10,
    104: 10,
    105: 10,
    106: 10,
    107: 10,
  });

  const [promoQuantities, setPromoQuantities] = useState<Record<number, number>>({
    101: 20,
    102: 20,
    103: 20,
    104: 20,
    105: 20,
    106: 20,
    107: 20,
  });

  const filteredProducts = useMemo(() => {
    return dummyProducts.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        (product.authorsName &&
          product.authorsName.some((a) =>
            a.toLowerCase().includes(search.toLowerCase().trim())
          ));
      return matchSearch;
    });
  }, [search]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page, pageSize]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;

  const isAllPaginatedSelected = useMemo(() => {
    if (paginatedProducts.length === 0) return false;
    return paginatedProducts.every((p) => selectedIds.includes(p.id));
  }, [paginatedProducts, selectedIds]);

  const handleToggleSelectAll = () => {
    if (isAllPaginatedSelected) {
      const paginatedIds = paginatedProducts.map((p) => p.id);
      onChange(selectedIds.filter((id) => !paginatedIds.includes(id)));
    } else {
      const newIds = Array.from(
        new Set([...selectedIds, ...paginatedProducts.map((p) => p.id)])
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

  const handleQuantityChange = useCallback((id: number, val: number) => {
    const product = dummyProducts.find((p) => p.id === id);
    const maxStock = product ? product.quantity : 0;
    const safeVal = isNaN(val) ? 0 : val < 0 ? 0 : val > maxStock ? maxStock : val;
    setPromoQuantities((prev) => {
      if (prev[id] === safeVal) return prev;
      return {
        ...prev,
        [id]: safeVal,
      };
    });
  }, []);

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
              Tích chọn sản phẩm, nhập mức giảm giá (%) và số lượng áp dụng cho từng sản phẩm
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên sách hoặc tác giả..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3.5 py-2 text-xs placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 shadow-2xs"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80">
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
              <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider w-32">
                Giá nhập
              </th>
              <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider w-32">
                Giá bán
              </th>
              <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider w-36 text-center text-indigo-600">
                Mức giảm (%)
              </th>
              <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider w-40">
                Giá cuối cùng
              </th>
              <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider w-24 text-center">
                Tồn kho
              </th>
              <th className="py-3.5 px-4 font-semibold text-xs uppercase tracking-wider w-36 text-right">
                Số lượng áp dụng
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center">
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
              paginatedProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isSelected={selectedIds.includes(product.id)}
                  initialDiscount={discountsMap[product.id] ?? 10}
                  initialPromoQty={promoQuantities[product.id] ?? 20}
                  onToggleSelect={() => handleToggleSelectOne(product.id)}
                  onDiscountChange={(val) => handleDiscountChange(product.id, val)}
                  onQuantityChange={(val) => handleQuantityChange(product.id, val)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filteredProducts.length}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
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
}

const ProductRow: React.FC<ProductRowProps> = ({
  product,
  isSelected,
  initialDiscount,
  initialPromoQty,
  onToggleSelect,
  onDiscountChange,
  onQuantityChange,
}) => {
  // Local state cho typing mượt mà
  const [localDiscount, setLocalDiscount] = useState<string>(initialDiscount.toString());
  const [localQty, setLocalQty] = useState<string>(initialPromoQty.toString());

  // Debounce 300ms theo yêu cầu Clean Code
  const debouncedDiscountStr = useDebounce(localDiscount, 300);
  const debouncedQtyStr = useDebounce(localQty, 300);

  // Cập nhật khi initial thay đổi từ ngoài
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
  onDiscountChangeRef.current = onDiscountChange;

  const onQuantityChangeRef = useRef(onQuantityChange);
  onQuantityChangeRef.current = onQuantityChange;

  // Xử lý sync với parent sau khi debounce
  useEffect(() => {
    const num = parseFloat(debouncedDiscountStr);
    const safeVal = isNaN(num) ? 0 : num < 0 ? 0 : num > 100 ? 100 : num;
    if (safeVal !== initialDiscount) {
      onDiscountChangeRef.current(safeVal);
    }
  }, [debouncedDiscountStr, initialDiscount]);

  useEffect(() => {
    const num = parseInt(debouncedQtyStr, 10);
    if (!isNaN(num) && num > product.quantity) {
      setLocalQty(product.quantity.toString());
    }
    const safeVal = isNaN(num) ? 0 : num < 0 ? 0 : num > product.quantity ? product.quantity : num;
    if (safeVal !== initialPromoQty) {
      onQuantityChangeRef.current(safeVal);
    }
  }, [debouncedQtyStr, product.quantity, initialPromoQty]);

  const currentDiscountNum = useMemo(() => {
    const num = parseFloat(localDiscount);
    return isNaN(num) ? 0 : num;
  }, [localDiscount]);

  const finalPrice = useMemo(() => {
    return Math.round(product.price * (1 - currentDiscountNum / 100));
  }, [product.price, currentDiscountNum]);

  const isSellAtLoss = finalPrice < product.importPrice;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <tr
      onClick={onToggleSelect}
      className={`cursor-pointer transition-colors group ${
        isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/60"
      }`}
    >
      {/* CHECKBOX */}
      <td
        className="py-5 px-4 text-center align-middle"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </td>

      {/* THÔNG TIN SẢN PHẨM (Y HỆT PRODUCTTABLE VỚI KHOẢNG CÁCH NỚI RỘNG) */}
      <td className="py-5 px-4 align-middle">
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

      {/* GIÁ NHẬP */}
      <td className="py-5 px-4 align-middle">
        <span className="text-sm text-slate-600 font-medium">
          {formatPrice(product.importPrice)}
        </span>
      </td>

      {/* GIÁ BÁN HIỆN TẠI */}
      <td className="py-5 px-4 align-middle">
        <span className="font-bold text-slate-700 text-sm">
          {formatPrice(product.price)}
        </span>
      </td>

      {/* MỨC GIẢM GIÁ (%) — ĐỘ TƯƠNG PHẢN CAO */}
      <td
        className="py-5 px-4 align-middle text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inline-flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={100}
            disabled={!isSelected}
            value={localDiscount}
            onChange={(e) => setLocalDiscount(e.target.value)}
            className={`w-16 px-2.5 py-1.5 text-xs font-extrabold text-center rounded-xl border outline-none transition-all ${
              isSelected
                ? "border-slate-300 bg-white text-indigo-700 shadow-2xs hover:border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/70"
                : "border-slate-200 bg-slate-100/80 text-slate-400 cursor-not-allowed"
            }`}
          />
          <span className="text-xs font-bold text-slate-500">%</span>
        </div>
      </td>

      {/* GIÁ BÁN CUỐI CÙNG — CẢNH BÁO TOOLTIP CỐ ĐỊNH CHIỀU CAO (KHÔNG NHẢY LAYOUT) */}
      <td className="py-5 px-4 align-middle">
        <div className="flex flex-col gap-1 justify-center min-h-[44px]">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-indigo-600 text-sm">
              {formatPrice(finalPrice)}
            </span>
            {isSellAtLoss && (
              <span
                title="Cảnh báo: Giá bán cuối cùng đang thấp hơn giá nhập! Bạn có chắc chắn muốn tiếp tục?"
                className="inline-flex items-center justify-center p-1 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors cursor-help"
              >
                <AlertTriangle size={14} className="text-amber-600" />
              </span>
            )}
          </div>
          {isSellAtLoss && (
            <span className="text-[10px] font-semibold text-amber-700 leading-tight">
              Giá bán &lt; Giá nhập
            </span>
          )}
        </div>
      </td>

      {/* TỒN KHO */}
      <td className="py-5 px-4 align-middle text-center">
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

      {/* SỐ LƯỢNG ÁP DỤNG — ĐỘ TƯƠNG PHẢN CAO */}
      <td
        className="py-5 px-4 align-middle text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="number"
          min={1}
          max={product.quantity}
          disabled={!isSelected}
          value={localQty}
          onChange={(e) => handleQtyInputChange(e.target.value)}
          onBlur={handleQtyBlur}
          className={`w-20 px-2.5 py-1.5 text-xs font-extrabold text-right rounded-xl border outline-none transition-all ${
            isSelected
              ? "border-slate-300 bg-white text-slate-900 shadow-2xs hover:border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/70"
              : "border-slate-200 bg-slate-100/80 text-slate-400 cursor-not-allowed"
          }`}
        />
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
