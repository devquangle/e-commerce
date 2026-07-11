import React from "react";
import { useNavigate } from "react-router-dom";
import VoucherHeader from "@/modules/admin/voucher/components/VoucherHeader";
import VoucherFilter from "@/modules/admin/voucher/components/VoucherFilter";
import VoucherTable from "@/modules/admin/voucher/components/VoucherTable";
import VoucherMobileCard from "@/modules/admin/voucher/components/VoucherMobileCard";
import VoucherDeleteModal from "@/modules/admin/voucher/components/VoucherDeleteModal";
import Pagination from "@/components/common/Pagination";
import type { VoucherResponse } from "@/modules/admin/voucher/types/voucher.type";
import { VoucherStatus, getVoucherStatusLabel } from "@/modules/admin/voucher/types/voucher.status";
import { useFilterVoucher, useDeleteVoucher } from "@/modules/admin/voucher/hooks/useVoucher";
import useVoucherSearch from "@/modules/admin/voucher/hooks/useVoucherSearch";

export default function VoucherPage() {
  const navigate = useNavigate();
  const {
    keyword,
    status,
    startDate,
    endDate,
    page,
    size,
    debouncedKeyword,
    setPage,
    setSize,
    handleKeywordChange,
    handleStatusChange,
    handleStartDateChange,
    handleEndDateChange,
    handleResetFilter,
  } = useVoucherSearch();

  const { data: voucherData, isFetching } = useFilterVoucher({
    keyword: debouncedKeyword,
    status: status || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page: page,
    size: size,
  });

  const paginatedVouchers = voucherData?.items || [];
  const totalPages = voucherData?.totalPages || 1;
  const totalItems = voucherData?.totalItems || 0;

  const { mutate: deleteVoucher } = useDeleteVoucher();

  const handleCreateClick = () => {
    navigate("/admin/vouchers/add");
  };

  const handleEditClick = (voucher: VoucherResponse) => {
    navigate(`/admin/vouchers/edit/${voucher.id}`);
  };

  const [deleteModalState, setDeleteModalState] = React.useState<{ isOpen: boolean; voucher: VoucherResponse | null }>({
    isOpen: false,
    voucher: null,
  });

  const handleDelete = (voucher: VoucherResponse) => {
    setDeleteModalState({ isOpen: true, voucher });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.voucher) {
      deleteVoucher(deleteModalState.voucher.id, {
        onSuccess: () => {
          setDeleteModalState({ isOpen: false, voucher: null });
        }
      });
    } else {
      setDeleteModalState({ isOpen: false, voucher: null });
    }
  };

  const statusOptions = [
    { label: "Tất cả trạng thái", value: null },
    { label: getVoucherStatusLabel(VoucherStatus.ACTIVE), value: VoucherStatus.ACTIVE },
    { label: getVoucherStatusLabel(VoucherStatus.INACTIVE), value: VoucherStatus.INACTIVE },
    { label: getVoucherStatusLabel(VoucherStatus.DELETED), value: VoucherStatus.DELETED },
  ];

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
      {/* HEADER */}
      <VoucherHeader onCreate={handleCreateClick} />

      {/* FILTER & DATA */}
      <div className="card-custom">
        <VoucherFilter
          keyword={keyword}
          status={status}
          statusOptions={statusOptions}
          startDate={startDate}
          endDate={endDate}
          onKeywordChange={handleKeywordChange}
          onStatusChange={handleStatusChange}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onReset={handleResetFilter}
        />

        {/* DESKTOP TABLE */}
        <VoucherTable
          vouchers={paginatedVouchers}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          page={page}
          pageSize={size}
        />

        {/* MOBILE CARDS */}
        <VoucherMobileCard
          vouchers={paginatedVouchers}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalItems}
          pageSize={size}
          onPageSizeChange={setSize}
        />
      </div>

      <VoucherDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, voucher: null })}
        onConfirm={handleConfirmDelete}
        voucher={deleteModalState.voucher}
      />
    </div>
  );
}
