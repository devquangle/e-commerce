import { useState, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import Pagination from "@/components/common/Pagination";
import SelectBox from "@/components/common/SelectedBox";
import SeriesFormModal from "@/modules/admin/series/components/SeriesFormModal";
import SeriesDeleteModal from "@/modules/admin/series/components/SeriesDeleteModal";
import { Library, Plus, RotateCcw, Search } from "lucide-react";

import Button from "@/components/common/Button";
import { showErrorToast } from "@/utils/toastUtil";
import type { SeriesRequest, SeriesResponse } from "@/types/series";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";

import { mapServerErrors } from "@/utils/mapServerErrors";
import SeriesTable from "@/modules/admin/series/components/SeriesTable";
import SeriesMobileCard from "@/modules/admin/series/components/SeriesMobileCard";
import {
  useCreateSeries,
  useDeleteSeries,
  useFilterSeries,
  useUpdateSeries,
} from "@/modules/admin/series/hooks/useSeries";
import useSeriesFilter from "@/modules/admin/series/hooks/useSeriesFilter";

export default function SeriesPage() {
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
  } = useSeriesFilter();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);

  const [selectItem, setSelectItem] = useState<SeriesResponse | null>(null);

  const statusOptions = useMemo(
    () => [
      { label: "Tất cả trạng thái", value: null as BaseStatus | null },
      ...(Object.values(BaseStatus) as BaseStatus[]).map((value) => ({
        label: getBaseStatusLabel(value),
        value,
      })),
    ],
    [],
  );

  const { data: seriesData } = useFilterSeries({
    keyword: debouncedKeyword,
    status: status || undefined,
    page,
    size,
  });

  const filterSeries = seriesData?.items || [];

  // Handlers Filter removed (now in useSeriesFilter)

  const handleOpenDelete = (item: SeriesResponse) => {
    setSelectItem(item);
    setOpenDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setSelectItem(null);
    setOpenDeleteModal(false);
  };

  const createMutation = useCreateSeries();
  const updateMutation = useUpdateSeries();
  const deleteMutation = useDeleteSeries();

  const handleSubmitModal = async (req: SeriesRequest, setError: UseFormSetError<SeriesRequest>) => {
    if (selectItem) {
      if (updateMutation.isPending) return;
      try {
        await updateMutation.mutateAsync({ id: selectItem.id ?? 0, req });
        handleCloseSaveModal();
      } catch (error: unknown) {
        mapServerErrors(error, setError, showErrorToast);
      }
    } else {
      if (createMutation.isPending) return;
      try {
        await createMutation.mutateAsync(req);
        handleCloseSaveModal();
      } catch (error: unknown) {
        mapServerErrors(error, setError, showErrorToast);
      }
    }
  };

  const onSubmitDelete = async () => {
    if (!selectItem?.id) return;
    await deleteMutation.mutateAsync(selectItem.id);
    handleCloseDelete();
  };

  const handleOpenSaveModal = (item: SeriesResponse | null) => {
    setSelectItem(item);
    setOpenSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setSelectItem(null);
    setOpenSaveModal(false);
  };

  return (
    <>
      <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                <Library size={22} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Quản lý Series
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Quản lý danh sách series sách và mô tả của chúng.
            </p>
          </div>

          <Button
            type="button"
            color="primary"
            className="w-full sm:w-auto cursor-pointer"
            onClick={() => handleOpenSaveModal(null)}
          >
            <Plus size={18} />
            Thêm Series
          </Button>
        </div>

        {/* FILTER & TABLE */}
        <div className="card-custom">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên series..."
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>
            <div className="w-full md:w-56">
              <SelectBox<BaseStatus | null>
                options={statusOptions}
                value={status}
                onChange={(val) => handleStatusChange(val ?? null)}
                searchable={false}
              />
            </div>
            <button
              onClick={handleResetFilter}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw size={16} /> Làm mới
            </button>
          </div>

          <SeriesTable
            series={filterSeries}
            onEdit={handleOpenSaveModal}
            onDelete={handleOpenDelete}
          />
          <SeriesMobileCard
            series={filterSeries}
            onEdit={handleOpenSaveModal}
            onDelete={handleOpenDelete}
          />

          <Pagination
            currentPage={page}
            totalPages={seriesData?.totalPages || 1}
            onPageChange={(p) => setPage(p)}
            totalItems={seriesData?.totalItems || 0}
            pageSize={size}
            onPageSizeChange={(s) => {
              setSize(s);
              setPage(1);
            }}
          />
        </div>
      </div>

      <SeriesFormModal
        isOpen={openSaveModal}
        onClose={handleCloseSaveModal}
        selectItem={selectItem}
        onSubmit={handleSubmitModal}
      />

      <SeriesDeleteModal
        isOpen={openDeleteModal}
        onClose={handleCloseDelete}
        series={selectItem}
        onConfirm={onSubmitDelete}
      />
    </>
  );
}
