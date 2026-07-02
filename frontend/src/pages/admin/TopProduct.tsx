import { useState } from "react";
import type { TopProductItem, CategoryDistributionItem } from "@/modules/admin/top-product/types/topProduct.type";
import TopProductHeaderActions from "@/modules/admin/top-product/components/TopProductHeaderActions";
import TopProductMetrics from "@/modules/admin/top-product/components/TopProductMetrics";
import TopProductChart from "@/modules/admin/top-product/components/TopProductChart";
import TopProductCategoryDistribution from "@/modules/admin/top-product/components/TopProductCategoryDistribution";
import TopProductRankingTable from "@/modules/admin/top-product/components/TopProductRankingTable";
import TopProductInsights from "@/modules/admin/top-product/components/TopProductInsights";
import AdminFilterTabs from "@/components/admin/AdminFilterTabs";
import type { ViewTab } from "@/components/admin/AdminFilterTabs";

const topProducts: TopProductItem[] = [
  {
    rank: 1,
    name: "Nhà giả kim",
    category: "Tiểu thuyết",
    sold: 528,
    revenue: "47.520.000đ",
    growth: "+15.2%",
    stock: 96,
  },
  {
    rank: 2,
    name: "Muon kiep nhan sinh",
    category: "Ky nang song",
    sold: 476,
    revenue: "57.120.000đ",
    growth: "+12.7%",
    stock: 88,
  },
  {
    rank: 3,
    name: "Dac nhan tam",
    category: "Ky nang song",
    sold: 441,
    revenue: "52.920.000đ",
    growth: "+10.8%",
    stock: 74,
  },
  {
    rank: 4,
    name: "Tu duy nhanh va cham",
    category: "Tam ly",
    sold: 319,
    revenue: "44.660.000đ",
    growth: "+8.1%",
    stock: 61,
  },
  {
    rank: 5,
    name: "Cay cam ngot cua toi",
    category: "Van hoc Viet",
    sold: 286,
    revenue: "31.460.000đ",
    growth: "+7.4%",
    stock: 47,
  },
];

const categoryDistribution: CategoryDistributionItem[] = [
  { name: "Tiểu thuyết", percent: 31 },
  { name: "Kỹ năng sống", percent: 29 },
  { name: "Tâm lý", percent: 22 },
  { name: "Văn học Việt", percent: 18 },
];

export default function TopProduct() {
  const [duration, setDuration] = useState("30days");
  const [activeTab, setActiveTab] = useState<ViewTab>("table");
  const [dateRange, setDateRange] = useState("30days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <section className="flex-1 flex flex-col gap-4">
      <TopProductHeaderActions
        duration={duration}
        onDurationChange={setDuration}
      />

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
          setActiveTab("table"); 
          setStartDate("");
          setEndDate("");
        }}
      />

      <TopProductMetrics
        totalSold="2.050"
        totalSoldTrend="+14.8% so với kỳ trước"
        top5Revenue="233.680.000đ"
        top5RevenueTrend="+11.2% so với kỳ trước"
        leaderName="Nhà giả kim"
        leaderSold={528}
        highlightCategory="Tiểu thuyết"
        highlightCategoryShareText="Chiếm 31% tổng doanh thu"
      />

      {/* TAB CONTENT */}
      {activeTab === "table" ? (
        <>
          {/* BẢNG: Ranking Table */}
          <TopProductRankingTable topProducts={topProducts} />

          <TopProductInsights />
        </>
      ) : (
        <>
          {/* BIỂU ĐỒ: Chart + Category Distribution */}
          <div className="grid gap-4 xl:grid-cols-3">
            <TopProductChart topProducts={topProducts} />
            <TopProductCategoryDistribution categoryDistribution={categoryDistribution} />
          </div>

          <TopProductInsights />
        </>
      )}
    </section>
  );
}
