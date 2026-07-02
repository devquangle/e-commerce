import { useState } from "react";
import { 
  Banknote, 
  ShoppingBag, 
  Users, 
  Package, 
  FileSpreadsheet,
  Shapes,
  Library,
  PenTool,
  Layers,
  Percent,
  Ticket
} from "lucide-react";
import type { DashboardStat, RecentOrder } from "@/modules/admin/dashboard/types/dashboard.type";
import DashboardStatsCards from "@/modules/admin/dashboard/components/DashboardStatsCards";
import DashboardRevenueChart from "@/modules/admin/dashboard/components/DashboardRevenueChart";
import DashboardOrderStatus from "@/modules/admin/dashboard/components/DashboardOrderStatus";
import DashboardTopSelling from "@/modules/admin/dashboard/components/DashboardTopSelling";
import DashboardLowStock from "@/modules/admin/dashboard/components/DashboardLowStock";
import DashboardRecentOrders from "@/modules/admin/dashboard/components/DashboardRecentOrders";
import DashboardActivePromotions from "@/modules/admin/dashboard/components/DashboardActivePromotions";
import DashboardNotifications from "@/modules/admin/dashboard/components/DashboardNotifications";
import AdminFilterTabs from "@/components/admin/AdminFilterTabs";
import type { ViewTab } from "@/components/admin/AdminFilterTabs";

const stats: DashboardStat[] = [
  { 
    label: "Tổng doanh thu", 
    value: "1.245.500.000đ", 
    trend: "+12%", 
    isPositive: true,
    icon: Banknote,
    accentClass: "bg-indigo-500",
    iconColor: "text-indigo-600 bg-indigo-50"
  },
  { 
    label: "Tổng đơn hàng", 
    value: "1,286", 
    trend: "+9%", 
    isPositive: true,
    icon: ShoppingBag,
    accentClass: "bg-emerald-500",
    iconColor: "text-emerald-600 bg-emerald-50"
  },
  { 
    label: "Khách hàng", 
    value: "8,432", 
    trend: "+5%", 
    isPositive: true,
    icon: Users,
    accentClass: "bg-amber-500",
    iconColor: "text-amber-600 bg-amber-50"
  },
  { 
    label: "Sản phẩm", 
    value: "1,204", 
    trend: "+1%", 
    isPositive: true,
    icon: Package,
    accentClass: "bg-violet-500",
    iconColor: "text-violet-600 bg-violet-50"
  },
  { 
    label: "Thể loại", 
    value: "35", 
    trend: "+2", 
    isPositive: true,
    icon: Shapes,
    accentClass: "bg-pink-500",
    iconColor: "text-pink-600 bg-pink-50"
  },
  { 
    label: "Nhà xuất bản", 
    value: "24", 
    trend: "0", 
    isPositive: true,
    icon: Library,
    accentClass: "bg-teal-500",
    iconColor: "text-teal-600 bg-teal-50"
  },
  { 
    label: "Tác giả", 
    value: "156", 
    trend: "+12", 
    isPositive: true,
    icon: PenTool,
    accentClass: "bg-cyan-500",
    iconColor: "text-cyan-600 bg-cyan-50"
  },
  { 
    label: "Series", 
    value: "42", 
    trend: "+5", 
    isPositive: true,
    icon: Layers,
    accentClass: "bg-fuchsia-500",
    iconColor: "text-fuchsia-600 bg-fuchsia-50"
  },
  { 
    label: "Giảm giá", 
    value: "15", 
    trend: "-3", 
    isPositive: false,
    icon: Percent,
    accentClass: "bg-red-500",
    iconColor: "text-red-600 bg-red-50"
  },
  { 
    label: "Voucher", 
    value: "8", 
    trend: "+2", 
    isPositive: true,
    icon: Ticket,
    accentClass: "bg-orange-500",
    iconColor: "text-orange-600 bg-orange-50"
  },
];

const recentOrders: RecentOrder[] = [
  { id: "#DH1024", customer: "Nguyễn Văn A", total: "1.200.000đ", status: "Đã giao" },
  { id: "#DH1023", customer: "Trần Thị B", total: "860.000đ", status: "Đang xử lý" },
  { id: "#DH1022", customer: "Lê Văn C", total: "430.000đ", status: "Chờ xác nhận" },
  { id: "#DH1021", customer: "Phạm Thị D", total: "2.100.000đ", status: "Đã hủy" },
  { id: "#DH1020", customer: "Hoàng Minh", total: "150.000đ", status: "Đã giao" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<ViewTab>("chart");
  const [dateRange, setDateRange] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <section className="flex-1 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between card-custom">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard quản trị</h1>
          <p className="mt-1 text-sm text-slate-500">Tổng quan tình hình kinh doanh của cửa hàng.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-200 cursor-pointer active:scale-95">
          <FileSpreadsheet size={16} />
          Xuất báo cáo
        </button>
      </div>

      {/* FILTER + TABS */}
      <AdminFilterTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onReset={() => { 
          setDateRange("today"); 
          setActiveTab("chart"); 
          setStartDate("");
          setEndDate("");
        }}
      />

      {/* 1. KPI CARDS */}
      <DashboardStatsCards stats={stats} />

      {activeTab === "chart" ? (
        <>
          {/* 2 & 3. CHARTS: Revenue & Order Status */}
          <div className="grid gap-6 lg:grid-cols-3">
            <DashboardRevenueChart />
            <DashboardOrderStatus />
          </div>

          {/* 4 & 5. Top Selling & Low Stock */}
          <div className="grid gap-6 lg:grid-cols-3">
            <DashboardTopSelling />
            <DashboardLowStock />
          </div>

          {/* 6, 7 & 8. Recent Orders, Promos & Notifications */}
          <div className="grid gap-6 lg:grid-cols-3">
            <DashboardRecentOrders recentOrders={recentOrders} />
            <div className="flex flex-col gap-6 h-full">
              <DashboardActivePromotions />
            </div>
            <div className="flex flex-col gap-6 h-full">
              <DashboardNotifications />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* TAB BẢNG: Ưu tiên Table Data */}
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* 6. Recent Orders */}
              <DashboardRecentOrders recentOrders={recentOrders} />
              
              {/* 4. Top Selling */}
              <DashboardTopSelling />
            </div>

            <div className="flex flex-col gap-6 h-full">
              {/* 8. Notifications */}
              <DashboardNotifications />
              
              {/* 5. Low Stock */}
              <DashboardLowStock />
              
              {/* 7. Active Promotions */}
              <DashboardActivePromotions />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
