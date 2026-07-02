import { useState } from "react";
import { Download } from "lucide-react";
import type { MonthlyRevenue } from "@/modules/admin/revenue/types/revenue.type";
import RevenueMetrics from "@/modules/admin/revenue/components/RevenueMetrics";
import RevenueChart from "@/modules/admin/revenue/components/RevenueChart";
import RevenueBreakdown from "@/modules/admin/revenue/components/RevenueBreakdown";
import RevenueTransactions from "@/modules/admin/revenue/components/RevenueTransactions";
import AdminFilterTabs from "@/components/admin/AdminFilterTabs";
import type { ViewTab } from "@/components/admin/AdminFilterTabs";

const monthlyRevenue: MonthlyRevenue[] = [
  { month: "Tháng 1", revenue: 220, growth: "+6%", isGrowth: true },
  { month: "Tháng 2", revenue: 245, growth: "+11%", isGrowth: true },
  { month: "Tháng 3", revenue: 278, growth: "+13%", isGrowth: true },
  { month: "Tháng 4", revenue: 260, growth: "-6%", isGrowth: false },
  { month: "Tháng 5", revenue: 302, growth: "+16%", isGrowth: true },
  { month: "Tháng 6", revenue: 335, growth: "+11%", isGrowth: true },
];

export default function Revenue() {
  const [activeTab, setActiveTab] = useState<ViewTab>("chart");
  const [dateRange, setDateRange] = useState("30days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <section className="flex-1 flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between card-custom">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Báo cáo doanh thu</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tổng hợp doanh thu nhà sách theo tháng từ website và đơn hàng trực tiếp.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-200 cursor-pointer active:scale-95">
          <Download size={16} />
          Tải báo cáo PDF
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
          setDateRange("30days"); 
          setActiveTab("chart"); 
          setStartDate("");
          setEndDate("");
        }}
      />

      {/* METRIC CARDS */}
      <RevenueMetrics
        monthlyRevenueText="335.000.000đ"
        monthlyRevenueTrend="+11%"
        averageOrderValueText="215.000đ"
        averageOrderValueTrend="+4.2%"
        returnRateText="1.6%"
        returnRateTrend="-0.3%"
      />

      {/* TAB CONTENT */}
      {activeTab === "chart" ? (
        <>
          {/* BIỂU ĐỒ: Chart + Breakdown */}
          <RevenueChart monthlyRevenue={monthlyRevenue} />

          <div className="grid gap-4 lg:grid-cols-3">
            <RevenueBreakdown />
            <div className="lg:col-span-2">
              <RevenueTransactions />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* BẢNG: Transactions table + Breakdown */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueTransactions />
            </div>
            <RevenueBreakdown />
          </div>

          <RevenueChart monthlyRevenue={monthlyRevenue} />
        </>
      )}
    </section>
  );
}
