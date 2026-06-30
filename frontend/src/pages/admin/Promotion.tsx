import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PromotionHeader from "@/modules/admin/promotion/components/PromotionHeader";
import PromotionFilter from "@/modules/admin/promotion/components/PromotionFilter";
import PromotionTable from "@/modules/admin/promotion/components/PromotionTable";
import PromotionMobileCard from "@/modules/admin/promotion/components/PromotionMobileCard";
import Pagination from "@/components/common/Pagination";
import type { PromotionResponse } from "@/modules/admin/promotion/types/promotion.type";
import useSearchPromotion from "@/modules/admin/promotion/hooks/useSearchPromotion";
import { useSearchPromotion as useSearchPromotionQuery, useDeletePromotion } from "@/modules/admin/promotion/hooks/usePromotion";
import Modal from "@/components/common/Modal";

export default function Promotion() {
  const navigate = useNavigate();
  const deleteMutation = useDeletePromotion();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPromoId, setSelectedPromoId] = useState<number | null>(null);

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

  const { data } = useSearchPromotionQuery({
    keyword: debouncedKeyword || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    promotionCampaignType: promotionCampaignType === "ALL" ? undefined : promotionCampaignType,
    status: status === "ALL" ? undefined : status,
    page,
    size: pageSize,
  });

  const promotionsList = useMemo(() => {
    return data?.items || [];
  }, [data]);

  const selectedPromo = useMemo(() => {
    return promotionsList.find((p) => p.id === selectedPromoId) || null;
  }, [promotionsList, selectedPromoId]);

  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;

  const handleCreateClick = () => {
    navigate("/admin/add-promotion");
  };

  const handleEditClick = (promo: PromotionResponse) => {
    navigate(`/admin/edit-promotion/${promo.id}`);
  };

  const handleDeleteClick = useCallback((id: number) => {
    setSelectedPromoId(id);
    setOpenDeleteModal(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setOpenDeleteModal(false);
    setSelectedPromoId(null);
  }, []);

  const onSubmitDelete = async () => {
    if (selectedPromoId === null) return;
    await deleteMutation.mutateAsync(selectedPromoId);
    handleCloseDeleteModal();
  };

  return (
    <>
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
            onDelete={handleDeleteClick}
            page={page}
            pageSize={pageSize}
          />

          {/* MOBILE CARDS */}
          <PromotionMobileCard
            promotions={promotionsList}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
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

      {/* CONFIRM DELETE MODAL */}
      <Modal
        isOpen={openDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Xóa khuyến mãi"
        onConfirm={onSubmitDelete}
        confirmText="Xóa khuyến mãi"
        cancelText="Hủy"
      >
        <div className="py-2">
          {selectedPromo && (
            <p className="text-slate-700 text-base leading-relaxed">
              Bạn có chắc chắn muốn xóa chương trình khuyến mãi{" "}
              <span className="font-bold text-slate-900">
                "{selectedPromo.name}"
              </span>
              ?
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
