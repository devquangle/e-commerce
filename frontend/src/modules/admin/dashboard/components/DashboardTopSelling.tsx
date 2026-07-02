import React, { useState } from "react";
import { Trophy, Medal, ChevronDown, ChevronUp } from "lucide-react";

const topSelling = [
  { rank: 1, name: "Nhà Giả Kim", category: "Tiểu thuyết", sold: 528, revenue: "47.520.000đ" },
  { rank: 2, name: "Muôn Kiếp Nhân Sinh", category: "Kỹ năng sống", sold: 476, revenue: "57.120.000đ" },
  { rank: 3, name: "Đắc Nhân Tâm", category: "Kỹ năng sống", sold: 441, revenue: "52.920.000đ" },
  { rank: 4, name: "Tư Duy Nhanh Và Chậm", category: "Tâm lý", sold: 319, revenue: "44.660.000đ" },
  { rank: 5, name: "Cây Cam Ngọt Của Tôi", category: "Văn học Việt", sold: 286, revenue: "31.460.000đ" },
  { rank: 6, name: "Dám Bị Ghét", category: "Tâm lý", sold: 254, revenue: "25.146.000đ" },
  { rank: 7, name: "Sapiens", category: "Lịch sử", sold: 212, revenue: "42.400.000đ" },
  { rank: 8, name: "Sức Mạnh Của Thói Quen", category: "Kỹ năng sống", sold: 189, revenue: "22.680.000đ" },
  { rank: 9, name: "Không Diệt Không Sinh Đừng Sợ Hãi", category: "Tôn giáo", sold: 175, revenue: "15.750.000đ" },
  { rank: 10, name: "Lối Sống Tối Giản Của Người Nhật", category: "Đời sống", sold: 156, revenue: "12.480.000đ" },
];

const maxSold = Math.max(...topSelling.map((b) => b.sold));

const rankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "from-amber-400 to-yellow-500 text-white shadow-amber-200/60";
    case 2:
      return "from-slate-300 to-slate-400 text-white shadow-slate-200/60";
    case 3:
      return "from-orange-400 to-amber-600 text-white shadow-orange-200/60";
    default:
      return "from-slate-100 to-slate-200 text-slate-500 shadow-none";
  }
};

const barColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "from-amber-400 to-yellow-500";
    case 2:
      return "from-slate-400 to-slate-500";
    case 3:
      return "from-orange-400 to-amber-500";
    default:
      return "from-indigo-400 to-violet-500";
  }
};

const DashboardTopSelling: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedItems = isExpanded ? topSelling : topSelling.slice(0, 3);
  const hasMore = topSelling.length > 3;

  return (
    <div className="card-custom lg:col-span-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-600">
          <Trophy size={18} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Sách bán chạy nhất</h2>
      </div>

      {/* List */}
      <div className="space-y-3">
        {displayedItems.map((book) => (
          <div
            key={book.rank}
            className="group flex items-center gap-4 rounded-xl p-3 -mx-1 transition-all duration-200 hover:bg-slate-50/80"
          >
            {/* Rank badge */}
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br font-bold text-sm shrink-0 shadow-sm ${rankStyle(book.rank)}`}
            >
              {book.rank <= 3 ? (
                <Medal size={18} />
              ) : (
                <span>{book.rank}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-semibold text-sm text-slate-900 truncate">
                  {book.name}
                </span>
                <span className="shrink-0 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 border border-indigo-100/50">
                  {book.category}
                </span>
              </div>

              {/* Sales bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor(book.rank)} transition-all duration-500`}
                    style={{ width: `${(book.sold / maxSold) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500 tabular-nums shrink-0">
                  {book.sold} đã bán
                </span>
              </div>
            </div>

            {/* Revenue */}
            <div className="text-right shrink-0 hidden sm:block">
              <span className="text-sm font-bold text-slate-900">{book.revenue}</span>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                Thu gọn <ChevronUp size={16} />
              </>
            ) : (
              <>
                Xem thêm <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardTopSelling;
