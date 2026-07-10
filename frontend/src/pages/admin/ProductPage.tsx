import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/common/Pagination";

import type { ProductResponse } from "@/modules/admin/product/types/product.type";
import ProductTable from "@/modules/admin/product/components/ProductTable";
import ProductMobileCard from "@/modules/admin/product/components/ProductMobileCard";
import {
  useDeleteProduct,
  useFilterProduct,
} from "@/modules/admin/product/hooks/useProduct";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import useProductFilter from "@/modules/admin/product/hooks/useProductFilter";
import ProductHeader from "@/modules/admin/product/components/ProductHeader";
import ProductFilter from "@/modules/admin/product/components/ProductFilter";
import ProductDeleteModal from "@/modules/admin/product/components/ProductDeleteModal";

const statusOptions: { label: string; value: BaseStatus | null }[] = [
  { label: "Tất cả trạng thái", value: null },
  ...(Object.values(BaseStatus) as BaseStatus[])
    .filter((v) => v !== BaseStatus.DELETED)
    .map((value) => ({
      label: getBaseStatusLabel(value),
      value,
    })),
];

export default function Product() {
  const navigate = useNavigate();

  const {
    keyword,
    status,
    page,
    size,
    debouncedKeyword,
    setPage,
    setSize,
    handleKeywordChange,
    handleStatusChange,
    handleResetFilter,
  } = useProductFilter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectItem, setSelectItem] = useState<ProductResponse | null>(null);

  const { data: products } = useFilterProduct({
    keyword: debouncedKeyword || undefined,
    status: status || undefined,
    page,
    size,
  });

  const filterProducts = products?.items || [];

  const handleOpenDelete = useCallback((item: ProductResponse) => {
    setSelectItem(item);
    setOpenDeleteModal(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setSelectItem(null);
    setOpenDeleteModal(false);
  }, []);

  const deleteMutation = useDeleteProduct();

  const onSubmitDelete = async () => {
    if (!selectItem?.id) return;
    await deleteMutation.mutateAsync(selectItem.id);
    handleCloseDelete();
  };

  const memoStatusOptions = useMemo(() => statusOptions, []);

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
      {/* HEADER */}
      <ProductHeader onCreate={() => navigate("/admin/product/add")} />

      {/* FILTER & TABLE */}
      <div className="card-custom">
        <ProductFilter
          keyword={keyword}
          status={status}
          statusOptions={memoStatusOptions}
          onKeywordChange={handleKeywordChange}
          onStatusChange={handleStatusChange}
          onReset={handleResetFilter}
        />

        <ProductTable products={filterProducts} onDelete={handleOpenDelete} />
        <ProductMobileCard
          products={filterProducts}
          onDelete={handleOpenDelete}
        />
        {/* PAGINATION */}
        {products && products.totalItems > 0 && (
          <Pagination
            currentPage={page}
            totalPages={products?.totalPages || 1}
            onPageChange={setPage}
            totalItems={products?.totalItems || 0}
            pageSize={size}
            onPageSizeChange={(s) => {
              setSize(s);
              setPage(1);
            }}
          />
        )}
      </div>

      {/* DELETE MODAL */}
      <ProductDeleteModal
        isOpen={openDeleteModal}
        product={selectItem}
        onClose={handleCloseDelete}
        onConfirm={onSubmitDelete}
      />
    </div>
  );
}
