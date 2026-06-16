import { useState } from "react";

interface CheckboxListProps {
  title: string;
  items: string[];
  limit: number;
}

// Định nghĩa đúng cấu trúc Props nhận vào
interface FilterContentProps {
  priceRange?: number; // Đổi thành dấu ? để phòng hờ file cha truyền thiếu
  setPriceRange?: (value: number) => void;
}

/* ================= DATA ================= */
const categories = [
  "Tiểu thuyết", "Kinh tế", "CNTT", "Thiếu nhi", 
  "Lịch sử", "Kỹ năng sống", "Tâm lý", "Giáo dục"
];

const authors = [
  "Nguyễn Nhật Ánh", "Dale Carnegie", "J.K Rowling", 
  "Paulo Coelho", "Haruki Murakami", "Dan Brown", "Yuval Noah Harari"
];

/* ================= CHECKBOX LIST ================= */
function CheckboxList({ title, items, limit = 5 }: CheckboxListProps) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, limit);
  const hasMore = items.length > limit;

  return (
    <div>
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{title}</h4>
      <div className="space-y-2">
        {visibleItems.map(item => (
          <label key={item} className="flex items-center gap-2.5 text-sm font-medium text-slate-600 cursor-pointer select-none hover:text-indigo-600 transition-colors">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500/20 cursor-pointer"
            />
            {item}
          </label>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors block"
        >
          {expanded ? "Thu gọn" : `Xem thêm (${items.length - limit})`}
        </button>
      )}
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function FilterContent({ 
  priceRange = 500000, // Gán giá trị mặc định 500k nếu prop bị undefined
  setPriceRange 
}: FilterContentProps) {
  
  // Hàm format hiển thị tiền VNĐ (Ví dụ: 250.000 ₫)
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="space-y-6">

      {/* THE LOAI */}
      <CheckboxList title="Thể loại" items={categories} limit={5} />

      <hr className="border-slate-100" />

      {/* TAC GIA */}
      <CheckboxList title="Tác giả" items={authors} limit={5} />

      <hr className="border-slate-100" />

      {/* RATING */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Đánh giá</h4>
        <div className="space-y-2">
          {[5, 4, 3].map(r => (
            <label key={r} className="flex items-center gap-2.5 text-sm font-medium text-slate-600 cursor-pointer select-none hover:text-indigo-600 transition-colors">
              <input 
                type="radio" 
                name="rating" 
                className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500/20 cursor-pointer"
              />
              <span>{r} sao trở lên</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* PRICE RANGE - ĐÃ SỬA LỖI KHÔNG HIỂN THỊ */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khoảng giá</h4>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
            Dưới {formatCurrency(priceRange)}
          </span>
        </div>
        
        <div className="relative pt-1">
          <input 
            type="range" 
            min="0"
            max="500000"
            step="10000"
            value={priceRange}
            onChange={(e) => {
              if (setPriceRange) {
                setPriceRange(Number(e.target.value));
              }
            }}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all focus:outline-none" 
          />
        </div>

        <div className="flex justify-between text-[11px] font-bold text-slate-400">
          <span>0đ</span>
          <span>500.000đ</span>
        </div>
      </div>

    </div>
  );
}