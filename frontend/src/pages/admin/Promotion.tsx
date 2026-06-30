import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PromotionHeader from "@/modules/admin/promotion/components/PromotionHeader";
import PromotionFilter from "@/modules/admin/promotion/components/PromotionFilter";
import PromotionTable from "@/modules/admin/promotion/components/PromotionTable";
import PromotionMobileCard from "@/modules/admin/promotion/components/PromotionMobileCard";
import Pagination from "@/components/common/Pagination";
import type { PromotionResponse } from "@/modules/admin/promotion/types/promotion.type";
import { BaseStatus } from "@/types/status";
import useSearchPromotion from "@/modules/admin/promotion/hooks/useSearchPromotion";

const initialPromotions: PromotionResponse[] = [
  {
    id: 1,
    name: "Ưu đãi đón hè rực rỡ",
    discountValue: 10,
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    status: BaseStatus.ACTIVE,
    promotionCampaignType: "PRODUCT_DISCOUNT",
  },
  {
    id: 2,
    name: "Miễn phí vận chuyển đầu tháng",
    discountValue: 15,
    startDate: "2026-05-05",
    endDate: "2026-05-20",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "SEASONAL",
  },
  {
    id: 3,
    name: "Tri ân khách hàng thân thiết",
    discountValue: 20,
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "PRODUCT_DISCOUNT",
  },
  {
    id: 4,
    name: "Tựu trường rộn ràng",
    discountValue: 15,
    startDate: "2026-08-15",
    endDate: "2026-09-15",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "SEASONAL",
  },
  {
    id: 5,
    name: "Ngày quốc tế thiếu nhi",
    discountValue: 25,
    startDate: "2026-05-28",
    endDate: "2026-06-03",
    status: BaseStatus.ACTIVE,
    promotionCampaignType: "PRODUCT_DISCOUNT",
  },
  {
    id: 6,
    name: "Tết trung thu rước đèn",
    discountValue: 12,
    startDate: "2026-09-01",
    endDate: "2026-09-20",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "SEASONAL",
  },
  {
    id: 7,
    name: "Siêu bão giá Black Friday",
    discountValue: 30,
    startDate: "2026-11-20",
    endDate: "2026-11-30",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "FLASH_SALE",
  },
  {
    id: 8,
    name: "Chào năm mới hạnh phúc",
    discountValue: 20,
    startDate: "2026-01-01",
    endDate: "2026-01-15",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "SEASONAL",
  },
  {
    id: 9,
    name: "Mua combo sách văn học",
    discountValue: 25,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    status: BaseStatus.ACTIVE,
    promotionCampaignType: "PRODUCT_DISCOUNT",
  },
  {
    id: 10,
    name: "Lễ hội truyện tranh Manga",
    discountValue: 18,
    startDate: "2026-06-10",
    endDate: "2026-06-25",
    status: BaseStatus.ACTIVE,
    promotionCampaignType: "FLASH_SALE",
  },
  {
    id: 11,
    name: "Đêm đọc sách tiểu thuyết",
    discountValue: 18,
    startDate: "2026-04-15",
    endDate: "2026-04-25",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "PRODUCT_DISCOUNT",
  },
  {
    id: 12,
    name: "Tri ân thầy cô 20/11",
    discountValue: 20,
    startDate: "2026-11-15",
    endDate: "2026-11-22",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "SEASONAL",
  },
  {
    id: 13,
    name: "Mùng 8 tháng 3 yêu thương",
    discountValue: 15,
    startDate: "2026-03-01",
    endDate: "2026-03-09",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "SEASONAL",
  },
  {
    id: 14,
    name: "Cuối tuần siêu ưu đãi",
    discountValue: 10,
    startDate: "2026-06-26",
    endDate: "2026-06-28",
    status: BaseStatus.ACTIVE,
    promotionCampaignType: "FLASH_SALE",
  },
  {
    id: 15,
    name: "Tháng 5 may mắn",
    discountValue: 10,
    startDate: "2026-05-01",
    endDate: "2026-05-15",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "SEASONAL",
  },
  {
    id: 16,
    name: "Thắp sáng tri thức trẻ",
    discountValue: 15,
    startDate: "2026-06-15",
    endDate: "2026-07-15",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "PRODUCT_DISCOUNT",
  },
  {
    id: 17,
    name: "Sách kinh tế khởi nghiệp",
    discountValue: 20,
    startDate: "2026-06-01",
    endDate: "2026-06-20",
    status: BaseStatus.ACTIVE,
    promotionCampaignType: "PRODUCT_DISCOUNT",
  },
  {
    id: 18,
    name: "Sách tâm lý kỹ năng sống",
    discountValue: 12,
    startDate: "2026-05-10",
    endDate: "2026-05-25",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "PRODUCT_DISCOUNT",
  },
  {
    id: 19,
    name: "Flash Sale ngày đôi 6/6",
    discountValue: 35,
    startDate: "2026-06-06",
    endDate: "2026-06-06",
    status: BaseStatus.INACTIVE,
    promotionCampaignType: "FLASH_SALE",
  },
  {
    id: 20,
    name: "Sách gối đầu giường mùa hè",
    discountValue: 15,
    startDate: "2026-06-15",
    endDate: "2026-07-05",
    status: BaseStatus.ACTIVE,
    promotionCampaignType: "SEASONAL",
  },
];

export default function Promotion() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<PromotionResponse[]>(initialPromotions);

  const {
    keyword,
    startDate,
    endDate,
    promotionCampaignType,
    status,
    page,
    size: pageSize,
    debouncedKeyword,
    setPage,
    setSize: setPageSize,
    handleKeywordChange,
    handleStartDateChange,
    handleEndDateChange,
    handleCampaignTypeChange,
    handleStatusChange,
    handleResetFilter,
  } = useSearchPromotion();

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      const matchSearch = promo.name.toLowerCase().includes(debouncedKeyword.toLowerCase().trim());
      const matchStatus =
        status === "ALL" ? true : promo.status === status;
      const matchCampaignType =
        promotionCampaignType === "ALL" ? true : promo.promotionCampaignType === promotionCampaignType;
      const matchStartDate = startDate ? promo.startDate >= startDate : true;
      const matchEndDate = endDate ? promo.endDate <= endDate : true;

      return matchSearch && matchStatus && matchCampaignType && matchStartDate && matchEndDate;
    });
  }, [promotions, debouncedKeyword, status, promotionCampaignType, startDate, endDate]);

  const paginatedPromotions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPromotions.slice(start, start + pageSize);
  }, [filteredPromotions, page, pageSize]);

  const totalPages = Math.ceil(filteredPromotions.length / pageSize) || 1;

  const handleCreateClick = () => {
    navigate("/admin/add-promotion");
  };

  const handleEditClick = (promo: PromotionResponse) => {
    navigate(`/admin/edit-promotion/${promo.id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khuyến mãi #${id}?`)) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
      {/* HEADER */}
      <PromotionHeader onCreate={handleCreateClick} />

      {/* FILTER & DATA */}
      <div className="card-custom">
        <PromotionFilter
          search={keyword}
          statusFilter={status}
          campaignTypeFilter={promotionCampaignType}
          startDateFilter={startDate}
          endDateFilter={endDate}
          onSearchChange={handleKeywordChange}
          onStatusFilterChange={handleStatusChange}
          onCampaignTypeFilterChange={handleCampaignTypeChange}
          onStartDateFilterChange={handleStartDateChange}
          onEndDateFilterChange={handleEndDateChange}
          onReset={handleResetFilter}
        />

        {/* DESKTOP TABLE */}
        <PromotionTable
          promotions={paginatedPromotions}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          page={page}
          pageSize={pageSize}
        />

        {/* MOBILE CARDS */}
        <PromotionMobileCard
          promotions={paginatedPromotions}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filteredPromotions.length}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
