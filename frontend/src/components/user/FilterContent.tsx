import { useState } from "react";

interface CheckboxListProps {
  title: string,
  items: string[],
  limit: number
}
/* ================= DATA ================= */
const categories = [
  "Tiểu thuyết",
  "Kinh tế",
  "CNTT",
  "Thiếu nhi",
  "Lịch sử",
  "Kỹ năng sống",
  "Tâm lý",
  "Giáo dục",
];

const authors = [
  "Nguyễn Nhật Ánh",
  "Dale Carnegie",
  "J.K Rowling",
  "Paulo Coelho",
  "Haruki Murakami",
  "Dan Brown",
  "Yuval Noah Harari",
];

/* ================= CHECKBOX LIST ================= */
function CheckboxList({ title, items, limit = 5 }:CheckboxListProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, limit);
  const hasMore = items.length > limit;

  return (
    <div>
      <h4 className="font-medium mb-2">{title}</h4>

      <div className="space-y-1">
        {visibleItems.map(item => (
          <label key={item} className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            {item}
          </label>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          {expanded
            ? "Thu gọn"
            : `Xem thêm (${items.length - limit})`}
        </button>
      )}
    </div>
  );
}

export default function FilterContent() {
  return (
    <div className="space-y-6">

      <CheckboxList
        title="Thể loại"
        items={categories}
        limit={5}
      />

      <CheckboxList
        title="Tác giả"
        items={authors}
        limit={5}
      />

      {/* RATING */}
      <div>
        <h4 className="font-medium mb-2">Đánh giá</h4>
        {[5, 4, 3].map(r => (
          <label key={r} className="flex items-center gap-2 text-sm mb-1">
            <input type="radio" name="rating" />
            {r} sao trở lên
          </label>
        ))}
      </div>

      {/* PRICE */}
      <div>
        <h4 className="font-medium mb-2">Giá</h4>
        <input type="range" className="w-full" />
      </div>
    </div>
  );
}
