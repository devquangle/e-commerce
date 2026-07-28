import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProductResponse } from "../types/product-detail.type";
import { registerLocale, getName } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";

registerLocale(viLocale);

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

interface ProductTableProps {
  product: Partial<ProductResponse>;
}

interface SpecField {
  key: string;
  label: string;
  value: React.ReactNode;
}

export default function ProductTable({ product }: ProductTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const fields: SpecField[] = [];

  // Tác giả
  const authorsList: { name: string; slug?: string }[] = [];
  if (product.productAuthors && product.productAuthors.length > 0) {
    product.productAuthors.forEach((a) =>
      authorsList.push({ name: formatFieldText(a.name), slug: a.slug })
    );
  } else if ((product as any).authors && Array.isArray((product as any).authors)) {
    (product as any).authors.forEach((a: any) => {
      if (typeof a === "string") authorsList.push({ name: formatFieldText(a) });
      else if (a?.name) authorsList.push({ name: formatFieldText(a.name), slug: a.slug });
    });
  }

  if (authorsList.length > 0) {
    fields.push({
      key: "authors",
      label: "Tác giả",
      value: (
        <div className="flex flex-wrap gap-1.5">
          {authorsList.map((author, idx) => (
            <span key={idx}>
              {author.slug ? (
                <Link to={`/products?authors=${author.slug}`} className="text-blue-600 hover:underline">
                  {author.name}
                </Link>
              ) : (
                <span className="text-slate-800 font-semibold">{author.name}</span>
              )}
              {idx < authorsList.length - 1 && <span className="text-slate-400">, </span>}
            </span>
          ))}
        </div>
      ),
    });
  }

  // Thể loại
  const genresList: { name: string; slug?: string }[] = [];
  if (product.productGenres && product.productGenres.length > 0) {
    product.productGenres.forEach((g) =>
      genresList.push({ name: formatFieldText(g.name), slug: g.slug })
    );
  } else if ((product as any).genres && Array.isArray((product as any).genres)) {
    (product as any).genres.forEach((g: any) => {
      if (typeof g === "string") genresList.push({ name: formatFieldText(g) });
      else if (g?.name) genresList.push({ name: formatFieldText(g.name), slug: g.slug });
    });
  }

  if (genresList.length > 0) {
    fields.push({
      key: "genres",
      label: "Thể loại",
      value: (
        <div className="flex flex-wrap gap-1.5 font-semibold text-blue-600">
          {genresList.map((genre, idx) => (
            <span key={idx}>
              {genre.slug ? (
                <Link to={`/products?genres=${genre.slug}`} className="hover:underline">
                  {genre.name}
                </Link>
              ) : (
                <span className="text-slate-800 font-semibold">{genre.name}</span>
              )}
              {idx < genresList.length - 1 && <span className="text-slate-400 font-normal">, </span>}
            </span>
          ))}
        </div>
      ),
    });
  }

  // Nhà xuất bản
  const publisherName = product.productPublisher?.name || formatFieldText((product as any).publisher);
  const publisherSlug = product.productPublisher?.slug;
  if (publisherName) {
    fields.push({
      key: "publisher",
      label: "Nhà xuất bản",
      value: publisherSlug ? (
        <Link to={`/products?publisher=${publisherSlug}`} className="text-blue-600 hover:underline">
          {publisherName}
        </Link>
      ) : (
        <span className="text-slate-800 font-semibold">{publisherName}</span>
      ),
    });
  }

  // Series
  const seriesName = product.productSeries?.name || formatFieldText((product as any).series);
  const seriesSlug = product.productSeries?.slug;
  if (seriesName && seriesName !== "Chưa cập nhật") {
    fields.push({
      key: "series",
      label: "Series",
      value: seriesSlug ? (
        <Link to={`/products?series=${seriesSlug}`} className="text-blue-600 hover:underline">
          {seriesName}
        </Link>
      ) : (
        <span className="text-slate-800 font-semibold">{seriesName}</span>
      ),
    });
  }

  // Năm xuất bản
  if (product.publishYear) {
    fields.push({
      key: "publishYear",
      label: "Năm xuất bản",
      value: product.publishYear
    });
  }

  // Ngôn ngữ
  if (product.language) {
    fields.push({
      key: "language",
      label: "Ngôn ngữ",
      value: getLanguageName(product.language)
    });
  }

  // Số trang
  if (product.pages && product.pages > 0) {
    fields.push({
      key: "pages",
      label: "Số trang",
      value: `${product.pages} trang`
    });
  }

  // Trọng lượng
  if (product.weight && product.weight > 0) {
    fields.push({
      key: "weight",
      label: "Trọng lượng",
      value: `${product.weight} g`
    });
  }

  const limit = product.productSeries ? 4 : 3;
  const visibleFields = isExpanded ? fields : fields.slice(0, limit);
  const hasMore = fields.length > limit;

  return (
    <div className="card-custom">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">Thông tin chi tiết</h2>

      <div className="flex flex-col text-sm divide-y divide-slate-100">
        {visibleFields.map((field) => (
          <div 
            key={field.key} 
            className="flex py-3 items-start transition-colors"
          >
            <div className="w-1/3 text-slate-400 font-medium shrink-0">{field.label}</div>
            <div className="flex-1 text-slate-800 font-semibold">{field.value}</div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors shadow-sm"
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </div>
      )}
    </div>
  );
}
