import React from "react";
import { Activity, ShoppingCart, Star, PackageX, UserPlus } from "lucide-react";

interface ActivityItem {
  id: number;
  type: "order" | "review" | "stock" | "customer";
  text: string;
  time: string;
}

const activities: ActivityItem[] = [
  { id: 1, type: "order", text: "Đơn hàng #DH1029 vừa được tạo bởi Nguyễn Văn An", time: "2 phút trước" },
  { id: 2, type: "review", text: "Hoàng Anh đánh giá 5 sao cho Đắc Nhân Tâm", time: "15 phút trước" },
  { id: 3, type: "stock", text: "Sách Nhà Giả Kim sắp hết hàng (còn 5 cuốn)", time: "32 phút trước" },
  { id: 4, type: "customer", text: "Khách hàng mới đăng ký: Trần Thị Mai", time: "1 giờ trước" },
  { id: 5, type: "order", text: "Đơn hàng #DH1028 đã được giao thành công", time: "2 giờ trước" },
];

const typeConfig: Record<ActivityItem["type"], { icon: React.ElementType; bg: string; color: string }> = {
  order: { icon: ShoppingCart, bg: "bg-indigo-50", color: "text-indigo-600" },
  review: { icon: Star, bg: "bg-amber-50", color: "text-amber-600" },
  stock: { icon: PackageX, bg: "bg-rose-50", color: "text-rose-600" },
  customer: { icon: UserPlus, bg: "bg-emerald-50", color: "text-emerald-600" },
};

const DashboardActivity: React.FC = () => {
  return (
    <div className="card-custom">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-50 text-violet-600">
          <Activity size={18} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Hoạt động gần đây</h2>
      </div>

      {/* Timeline */}
      <div className="relative">
        {activities.map((activity, index) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;
          const isLast = index === activities.length - 1;

          return (
            <div key={activity.id} className="relative flex gap-3 group">
              {/* Vertical line */}
              {!isLast && (
                <div className="absolute left-[17px] top-9 bottom-0 w-px bg-slate-100 group-hover:bg-slate-200 transition-colors" />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${config.bg} ${config.color} transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon size={16} />
              </div>

              {/* Content */}
              <div className={`flex-1 ${isLast ? "" : "pb-5"}`}>
                <p className="text-sm text-slate-700 font-medium leading-snug">
                  {activity.text}
                </p>
                <span className="text-xs text-slate-400 font-medium mt-1 inline-block">
                  {activity.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardActivity;
