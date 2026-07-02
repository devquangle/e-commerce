import React from "react";
import { Star, ShoppingBag, CornerDownRight, Trash2, Send } from "lucide-react";
import type { ReviewItem, ReviewStatus } from "../types/review.type";

interface ReviewFeedProps {
  filteredReviews: ReviewItem[];
  replyDrafts: Record<string, string>;
  onReplyChange: (id: string, val: string) => void;
  onReplySubmit: (id: string) => void;
}

const statusStyles: Record<ReviewStatus, string> = {
  "Đã duyệt": "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold",
  "Chờ duyệt": "bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold",
  "Bị báo cáo": "bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold",
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

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0]?.charAt(0)}${parts[parts.length - 1]?.charAt(0)}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getAvatarBg = (name: string) => {
  const colors = [
    "bg-indigo-50 text-indigo-700 border-indigo-100",
    "bg-violet-50 text-violet-700 border-violet-100",
    "bg-purple-50 text-purple-700 border-purple-100",
    "bg-pink-50 text-pink-700 border-pink-100",
  ];
  return colors[name.length % colors.length];
};

const ReviewFeed: React.FC<ReviewFeedProps> = ({
  filteredReviews,
  replyDrafts,
  onReplyChange,
  onReplySubmit,
}) => {
  return (
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
                  onChange={(event) => onReplyChange(review.id, event.target.value)}
                  rows={2}
                  placeholder={`Gửi lời phản hồi cảm ơn hoặc hỗ trợ tới ${review.user}...`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => onReplyChange(review.id, "")}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    Xóa nháp
                  </button>
                  <button
                    type="button"
                    onClick={() => onReplySubmit(review.id)}
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
  );
};

export default ReviewFeed;
