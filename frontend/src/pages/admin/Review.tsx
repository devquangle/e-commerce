import { useMemo, useState } from "react";
import { 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  Star, 
  Search, 
  RotateCcw,
  CornerDownRight,
  ShoppingBag,
  Trash2,
  Send
} from "lucide-react";

type ReviewStatus = "Đã duyệt" | "Chờ duyệt" | "Bị báo cáo";

type ReviewItem = {
  id: string;
  user: string;
  product: string;
  orderCode: string;
  rating: number;
  content: string;
  status: ReviewStatus;
  purchased: boolean;
  createdAt: string;
  adminReply?: string;
};

const statusStyles: Record<ReviewStatus, string> = {
  "Đã duyệt": "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold",
  "Chờ duyệt": "bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold",
  "Bị báo cáo": "bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold",
};

const mockReviews: ReviewItem[] = [
  {
    id: "RV1001",
    user: "Hoàng Anh",
    product: "Đắc Nhân Tâm",
    orderCode: "OD2201",
    rating: 5,
    content: "Sách mới, đóng gói cực kỳ cẩn thận và giao hàng siêu nhanh. Rất hài lòng với dịch vụ chăm sóc khách hàng của shop!",
    status: "Đã duyệt",
    purchased: true,
    createdAt: "05/05/2026",
    adminReply: "Cảm ơn bạn đã tin tưởng và ủng hộ shop. Chúc bạn có những giây phút đọc sách thật bổ ích!",
  },
  {
    id: "RV1002",
    user: "Minh Thu",
    product: "Nhà Giả Kim",
    orderCode: "OD2197",
    rating: 4,
    content: "Nội dung rất hay và ý nghĩa. Tuy nhiên góc sách hơi bị cong nhẹ một chút do quá trình vận chuyển. Shop nên bọc chống sốc kỹ hơn nhé.",
    status: "Chờ duyệt",
    purchased: true,
    createdAt: "04/05/2026",
  },
  {
    id: "RV1003",
    user: "Quốc Bảo",
    product: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
    orderCode: "OD2184",
    rating: 2,
    content: "Sách bị trầy xước bìa khá nhiều khi nhận được, mong shop kiểm tra kỹ hàng trước khi đóng gói gửi đi.",
    status: "Bị báo cáo",
    purchased: true,
    createdAt: "02/05/2026",
  },
];

export default function Review() {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [reviews, setReviews] = useState<ReviewItem[]>(mockReviews);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (!review.purchased) return false;

      const searchValue = search.trim().toLowerCase();
      const matchSearch =
        !searchValue ||
        review.user.toLowerCase().includes(searchValue) ||
        review.product.toLowerCase().includes(searchValue) ||
        review.orderCode.toLowerCase().includes(searchValue);

      const matchRating =
        ratingFilter === "ALL"
          ? true
          : ratingFilter === "LTE3"
            ? review.rating <= 3
            : review.rating === Number(ratingFilter);

      const matchStatus = statusFilter === "ALL" ? true : review.status === statusFilter;

      return matchSearch && matchRating && matchStatus;
    });
  }, [reviews, search, ratingFilter, statusFilter]);

  const handleReplyChange = (reviewId: string, value: string) => {
    setReplyDrafts((prev) => ({
      ...prev,
      [reviewId]: value,
    }));
  };

  const handleReplySubmit = (reviewId: string) => {
    const draft = replyDrafts[reviewId]?.trim();
    if (!draft) return;

    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              adminReply: draft,
            }
          : review
      )
    );

    setReplyDrafts((prev) => ({
      ...prev,
      [reviewId]: "",
    }));
  };

  const handleResetFilter = () => {
    setSearch("");
    setRatingFilter("ALL");
    setStatusFilter("ALL");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
            className={
              star <= rating 
                ? "fill-amber-400 text-amber-400" 
                : "text-slate-200 fill-transparent"
            }
          />
        ))}
      </div>
    );
  };

  // Get user avatar initials
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0]?.charAt(0)}${parts[parts.length - 1]?.charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Avatar pastel backgrounds based on length
  const getAvatarBg = (name: string) => {
    const colors = [
      "bg-indigo-50 text-indigo-700 border-indigo-100",
      "bg-violet-50 text-violet-700 border-violet-100",
      "bg-purple-50 text-purple-700 border-purple-100",
      "bg-pink-50 text-pink-700 border-pink-100",
    ];
    return colors[name.length % colors.length];
  };

  return (
    <section className="space-y-6 p-4 md:p-6 flex-1">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <MessageSquare size={22} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quản lý đánh giá</h1>
          </div>
          <p className="text-sm text-slate-500">
            Duyệt bình luận đánh giá sách từ khách hàng và gửi phản hồi chăm sóc chính thức.
          </p>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-500">Tổng đánh giá</p>
            <p className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              4.5
              <span className="text-sm font-normal text-slate-400 flex items-center gap-0.5">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                trung bình
              </span>
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Star size={24} className="fill-amber-500 text-amber-500" />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-500">Đánh giá chờ duyệt</p>
            <p className="text-3xl font-extrabold text-slate-900">1</p>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Clock size={24} />
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50 flex items-center justify-between hover:scale-[1.02] transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-500">Báo cáo vi phạm</p>
            <p className="text-3xl font-extrabold text-slate-900">1</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
            <AlertTriangle size={24} />
          </div>
        </article>
      </div>

      {/* FILTER & FEED */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50">
        {/* Filters */}
        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm người mua, sách hoặc mã đơn..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <select
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 cursor-pointer"
            >
              <option value="ALL">Tất cả số sao</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="LTE3">3 sao trở xuống</option>
            </select>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Bị báo cáo">Bị báo cáo</option>
            </select>

            <button
              onClick={handleResetFilter}
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
              title="Làm mới bộ lọc"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Feed list */}
        <div className="space-y-5">
          {filteredReviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-250 p-12 text-center text-slate-500 space-y-2">
              <span className="text-3xl filter drop-shadow">🔍</span>
              <p className="text-sm font-semibold">Không tìm thấy đánh giá nào phù hợp bộ lọc.</p>
              <p className="text-xs text-slate-400">Vui lòng điều chỉnh từ khóa tìm kiếm hoặc các tiêu chí lọc.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition duration-300 space-y-4">
                {/* Review Header info */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-3.5 border-b border-slate-50">
                  <div className="flex gap-3 items-center">
                    {/* User initials avatar */}
                    <div className={`h-11 w-11 rounded-full border flex items-center justify-center text-sm font-extrabold shadow-inner ${getAvatarBg(review.user)}`}>
                      {getInitials(review.user)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{review.user}</h3>
                        <span className="inline-flex items-center gap-1 rounded bg-indigo-50 border border-indigo-100/50 px-1.5 py-0.5 text-[10px] font-extrabold text-indigo-700">
                          <ShoppingBag size={10} />
                          ĐÃ MUA HÀNG
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded">
                          Sách: {review.product}
                        </span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                          Mã đơn: #{review.orderCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 sm:flex-col sm:items-end justify-between">
                    {renderStars(review.rating)}
                    <span className="text-[11px] text-slate-400 font-medium">
                      Ngày: {review.createdAt}
                    </span>
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${statusStyles[review.status]}`}>
                      {review.status}
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-100/30 text-sm text-slate-700 leading-relaxed italic">
                  "{review.content}"
                </div>

                {/* Admin Reply Area */}
                <div className="space-y-3.5 pt-1">
                  {review.adminReply ? (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-1.5 flex gap-3.5 items-start">
                      <div className="rounded-lg bg-emerald-500 p-1.5 text-white mt-0.5">
                        <CornerDownRight size={14} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Phản hồi từ Ban quản trị</p>
                        <p className="text-sm text-slate-800 leading-relaxed">{review.adminReply}</p>
                      </div>
                    </div>
                  ) : null}

                  {/* Input form response */}
                  <div className="space-y-3">
                    <textarea
                      value={replyDrafts[review.id] ?? ""}
                      onChange={(event) => handleReplyChange(review.id, event.target.value)}
                      rows={2}
                      placeholder={`Gửi lời phản hồi cảm ơn hoặc hỗ trợ tới ${review.user}...`}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => handleReplyChange(review.id, "")}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 size={13} />
                        Xóa nháp
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReplySubmit(review.id)}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 hover:shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <Send size={13} />
                        Gửi phản hồi
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
