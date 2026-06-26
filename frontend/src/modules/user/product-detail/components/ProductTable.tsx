import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProductResponse } from "../types/product.detail.type";
import { registerLocale, getName } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";

registerLocale(viLocale);

const getLanguageName = (code?: string) => {
  if (!code) return "";
  const name = getName(code, "vi");
  if (!name) return code;
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const toSlug = (str?: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[đĐ]/g, "d")
    .replace(/([^a-z0-9\s-]|_)+/g, "") // remove special characters
    .trim()
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/-+/g, "-"); // remove duplicate -
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
  if (product.productAuthors && product.productAuthors.length > 0) {
    fields.push({
      key: "authors",
      label: "Tác giả",
      value: (
        <div className="flex flex-wrap gap-1.5">
          {product.productAuthors.map((author, idx) => (
            <span key={author.id}>
              <Link to={`/products?authors=${toSlug(author.name)}`} className="text-blue-600 hover:underline">
                {author.name}
              </Link>
              {idx < product.productAuthors!.length - 1 && <span className="text-slate-400">, </span>}
            </span>
          ))}
        </div>
      )
    });
  }

  // Thể loại
  if (product.productGenres && product.productGenres.length > 0) {
    fields.push({
      key: "genres",
      label: "Thể loại",
      value: (
        <div className="flex flex-wrap gap-1.5 font-semibold text-blue-600">
          {product.productGenres.map((genre, idx) => (
            <span key={genre.id}>
              <Link to={`/products?genres=${toSlug(genre.name)}`} className="hover:underline">
                {genre.name}
              </Link>
              {idx < product.productGenres!.length - 1 && <span className="text-slate-400 font-normal">, </span>}
            </span>
          ))}
        </div>
      )
    });
  }

  // Nhà xuất bản
  if (product.publisherName) {
    fields.push({
      key: "publisher",
      label: "Nhà xuất bản",
      value: (
        <Link to={`/products?publisher=${toSlug(product.publisherName)}`} className="text-blue-600 hover:underline">
          {product.publisherName}
        </Link>
      )
    });
  }

  // Series
  if (product.seriesName) {
    fields.push({
      key: "series",
      label: "Series",
      value: (
        <Link to={`/products?series=${toSlug(product.seriesName)}`} className="text-blue-600 hover:underline">
          {product.seriesName}
        </Link>
      )
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

  const limit = product.seriesName ? 4 : 3;
  const visibleFields = isExpanded ? fields : fields.slice(0, limit);
  const hasMore = fields.length > limit;

  return (
    <div className="card-custom !p-6">
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
