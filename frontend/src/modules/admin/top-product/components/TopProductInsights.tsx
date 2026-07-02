import React from "react";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  Sparkles,
} from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    color: "border-emerald-500",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    title: "Tăng trưởng mạnh",
    text: "Nhà Giả Kim dẫn đầu với 528 bản bán ra, tăng 15.2% so với kỳ trước. Nên tăng lượng nhập hàng.",
  },
  {
    icon: AlertTriangle,
    color: "border-amber-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Cảnh báo tồn kho",
    text: "Cây Cam Ngọt Của Tôi chỉ còn 47 cuốn trong kho. Cần đặt hàng bổ sung sớm.",
  },
  {
    icon: Target,
    color: "border-indigo-500",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    title: "Cơ hội cross-sell",
    text: "Khách mua Đắc Nhân Tâm thường mua kèm Muôn Kiếp Nhân Sinh (32% tỷ lệ mua kèm).",
  },
  {
    icon: Lightbulb,
    color: "border-violet-500",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    title: "Đề xuất marketing",
    text: "Danh mục Kỹ Năng Sống chiếm 29% doanh thu. Nên chạy chiến dịch quảng cáo riêng cho nhóm này.",
  },
];

const TopProductInsights: React.FC = () => {
  return (
    <div className="card-custom">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Phân tích thông minh
        </h2>
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
          AI Insights
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.title}
              className={`rounded-xl border-l-4 ${insight.color} ${insight.bg} p-4 transition-shadow hover:shadow-md`}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/70 ${insight.iconColor}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  {insight.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                {insight.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopProductInsights;
