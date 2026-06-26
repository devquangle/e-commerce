import { useState, useMemo, useEffect, useCallback } from "react";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import { useSearchParams, Link } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import SelectBox from "@/components/common/SelectedBox";
import { BookOpen, Plus, RotateCcw, Search } from "lucide-react";


import type { ProductResponse } from "@/modules/admin/product/types/product.type";
import ProductTable from "@/modules/admin/product/components/ProductTable";
import ProductMobileCard from "@/modules/admin/product/components/ProductMobileCard";
import { useDeleteProduct, useFilterProduct } from "@/modules/admin/product/hooks/useProduct";
import type { BaseStatus } from "@/types/status";

const initialFilterOptions = { keyword: "", status: "", page: 1, size: 10 };

const statusOptions: { label: string; value: BaseStatus | null }[] = [
  { label: "Tất cả trạng thái", value: null },
  { label: "Đang bán", value: "ACTIVE" },
  { label: "Ngừng bán", value: "INACTIVE" },
];

export default function Product() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword,
  );
  const [status, setStatus] = useState<BaseStatus | null>(
    () => searchParams.get("status") as BaseStatus | null,
  );
  const [page, setPage] = useState<number>(
    () => Number(searchParams.get("page")) || initialFilterOptions.page,
  );
  const [size, setSize] = useState<number>(
    () => Number(searchParams.get("size")) || initialFilterOptions.size,
  );

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedKeyword) params.set("keyword", debouncedKeyword);
    if (status) params.set("status", status);
    if (page !== initialFilterOptions.page) params.set("page", page.toString());
    if (size !== initialFilterOptions.size) params.set("size", size.toString());
    setSearchParams(params, { replace: true });
  }, [debouncedKeyword, status, page, size, setSearchParams]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectItem, setSelectItem] = useState<ProductResponse | null>(null);

  const { data: products } = useFilterProduct({
    keyword: debouncedKeyword || undefined,
    status: status || undefined,
    page,
    size,
  });

  const filterProducts = products?.items || [];

  const handleKeywordChange = useCallback((val: string) => {
    setKeyword(val);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((val: BaseStatus | null) => {
    setStatus(val);
    setPage(1);
  }, []);

  const handleResetFilter = useCallback(() => {
    setKeyword("");
    setStatus(null);
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
  }, []);

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

  // Dùng useMemo để ổn định options status tránh re-render
  const memoStatusOptions = useMemo(() => statusOptions, []);

  return (
    <>
      <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <BookOpen size={22} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Quản lý sản phẩm
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Quản lý danh sách sách, giá bán và tồn kho trong hệ thống.
            </p>
          </div>

          <Link
            to="/admin/add-product"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            Thêm sản phẩm
          </Link>
        </div>

        {/* FILTER & TABLE */}
        <div className="card-custom">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên sách..."
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Status filter */}
            <div className="w-full md:w-52">
              <SelectBox<BaseStatus | null>
                options={memoStatusOptions}
                value={status}
                onChange={handleStatusChange}
                searchable={false}
              />
            </div>

            {/* Reset */}
            <button
              onClick={handleResetFilter}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw size={16} /> Làm mới
            </button>
          </div>

          <ProductTable products={filterProducts} onDelete={handleOpenDelete} />
          <ProductMobileCard products={filterProducts} onDelete={handleOpenDelete} />
        </div>

        {/* PAGINATION */}
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
      </div>

      {/* DELETE MODAL */}
      <Modal
        isOpen={openDeleteModal}
        onClose={handleCloseDelete}
        title="Xóa sản phẩm"
        onConfirm={onSubmitDelete}
        confirmText="Xóa sản phẩm"
        cancelText="Hủy"
      >
        <div className="py-2">
          {selectItem && (
            <p className="text-slate-700 text-base leading-relaxed">
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <span className="font-bold text-slate-900">
                "{selectItem.name}"
              </span>
              ?
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
