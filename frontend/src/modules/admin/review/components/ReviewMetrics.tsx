import React from "react";
import { Star, Clock, AlertTriangle } from "lucide-react";

interface ReviewMetricsProps {
  averageRating: number;
  pendingCount: number;
  reportedCount: number;
}

const ReviewMetrics: React.FC<ReviewMetricsProps> = ({
  averageRating,
  pendingCount,
  reportedCount,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article className="card-custom p-4 flex items-center justify-between hover:scale-[1.02]">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">Tổng đánh giá</p>
          <p className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            {averageRating}
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

      <article className="card-custom p-4 flex items-center justify-between hover:scale-[1.02]">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">Đánh giá chờ duyệt</p>
          <p className="text-3xl font-extrabold text-slate-900">{pendingCount}</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Clock size={24} />
        </div>
      </article>

      <article className="card-custom p-4 flex items-center justify-between hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-500">Báo cáo vi phạm</p>
          <p className="text-3xl font-extrabold text-slate-900">{reportedCount}</p>
        </div>
        <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
          <AlertTriangle size={24} />
        </div>
      </article>
    </div>
  );
};

export default ReviewMetrics;
