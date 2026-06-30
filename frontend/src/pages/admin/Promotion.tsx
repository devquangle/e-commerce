import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PromotionHeader from "@/modules/admin/promotion/components/PromotionHeader";
import PromotionFilter from "@/modules/admin/promotion/components/PromotionFilter";
import PromotionTable from "@/modules/admin/promotion/components/PromotionTable";
import PromotionMobileCard from "@/modules/admin/promotion/components/PromotionMobileCard";
import Pagination from "@/components/common/Pagination";
import type { PromotionResponse } from "@/modules/admin/promotion/types/promotion.type";
import useSearchPromotion from "@/modules/admin/promotion/hooks/useSearchPromotion";
import PromotionService from "@/modules/admin/promotion/services/promotion.service";



export default function Promotion() {
  const navigate = useNavigate();
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

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

  const { data } = useQuery({
    queryKey: [
      "promotions-search",
      {
        keyword: debouncedKeyword || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        promotionCampaignType: promotionCampaignType === "ALL" ? undefined : promotionCampaignType,
        status: status === "ALL" ? undefined : status,
        page,
        size: pageSize,
      },
    ],
    queryFn: () =>
      PromotionService.search({
        keyword: debouncedKeyword || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        promotionCampaignType: promotionCampaignType === "ALL" ? undefined : promotionCampaignType,
        status: status === "ALL" ? undefined : status,
        page,
        size: pageSize,
      }),
  });

  const promotionsList = useMemo(() => {
    const items = data?.items || [];
    return items.filter((promo) => !deletedIds.includes(promo.id));
  }, [data, deletedIds]);

  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;

  const handleCreateClick = () => {
    navigate("/admin/add-promotion");
  };

  const handleEditClick = (promo: PromotionResponse) => {
    navigate(`/admin/edit-promotion/${promo.id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khuyến mãi #${id}?`)) {
      setDeletedIds((prev) => [...prev, id]);
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
          promotions={promotionsList}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          page={page}
          pageSize={pageSize}
        />

        {/* MOBILE CARDS */}
        <PromotionMobileCard
          promotions={promotionsList}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
