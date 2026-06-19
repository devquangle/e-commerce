import { useState, useMemo, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { useForm, useWatch } from "react-hook-form";
import InputField from "@/components/common/InputField";
import Pagination from "@/components/common/Pagination";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import SelectBox from "@/components/common/SelectedBox";
import { Building2, Plus, RotateCcw, Search } from "lucide-react";

import Button from "@/components/common/Button";
import { showErrorToast } from "@/utils/toastUtil";
import type { PublisherRequest, PublisherResponse } from "@/types/publisher";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";

import { mapServerErrors } from "@/utils/mapServerErrors";
import PublisherTable from "@/features/admin/publisher/components/PublisherTable";
import PublisherMobileCard from "@/features/admin/publisher/components/PublisherMobileCard";
import { useCreatePublisher, useDeletePublisher, useFilterPublisher, useUpdatePublisher } from "@/features/admin/publisher/hooks/usePublisher";

const initialFilterOptions = { keyword: "", status: "", page: 1, size: 10 };
const initPublisher: PublisherRequest = {
  name: "",
  street: "",
  status: BaseStatus.ACTIVE,
};

export default function PublisherPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") ?? initialFilterOptions.keyword,
  );
  const [status, setStatus] = useState<BaseStatus | null>(
    (searchParams.get("status") as BaseStatus) ?? null,
  );
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || initialFilterOptions.page,
  );
  const [size, setSize] = useState<number>(
    Number(searchParams.get("size")) || initialFilterOptions.size,
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
  const [openSaveModal, setOpenSaveModal] = useState(false);

  const [selectItem, setSelectItem] = useState<PublisherResponse | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<PublisherRequest>({
    defaultValues: initPublisher,
  });

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

  const { data: publishers } = useFilterPublisher({
    keyword: debouncedKeyword,
    status: status || undefined,
    page,
    size,
  });

  const filterPublisher = publishers?.items || [];

  // Handlers Filter
  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    setPage(1);
  };
  const handleStatusChange = (val: BaseStatus | null) => {
    setStatus(val);
    setPage(1);
  };
  const handleResetFilter = () => {
    setKeyword("");
    setStatus(null);
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
  };

  const handleOpenDelete = (item: PublisherResponse) => {
    setSelectItem(item);
    setOpenDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setSelectItem(null);
    setOpenDeleteModal(false);
  };

  const createMutation = useCreatePublisher();
  const updateMutation = useUpdatePublisher();
  const deleteMutation = useDeletePublisher();

  const onSubmitAdd = async (req: PublisherRequest) => {
    if (createMutation.isPending) return;
    try {
      await createMutation.mutateAsync(req);
      handleCloseSaveModal();
    } catch (error: unknown) {
      mapServerErrors(error, setError, showErrorToast);
    }
  };

  const onSubmitUpdate = async (req: PublisherRequest) => {
    if (updateMutation.isPending) return;
    try {
      if (!selectItem) return;

      await updateMutation.mutateAsync({
        id: selectItem.id ?? 0,
        req,
      });

      handleCloseSaveModal();
    } catch (error: unknown) {
      mapServerErrors(error, setError, showErrorToast);
    }
  };

  const onSubmitDelete = async () => {
    if (!selectItem?.id) return;
    await deleteMutation.mutateAsync(selectItem.id);
    handleCloseDelete();
  };

  const handleOpenSaveModal = (item: PublisherResponse | null) => {
    if (item) {
      setSelectItem(item);
      reset({
        name: item.name,
        street: item.street || "",
        status: item.status,
      });
    } else {
      reset(initPublisher);
    }
    setOpenSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    reset(initPublisher);
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
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Building2 size={22} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Quản lý nhà xuất bản
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Quản lý danh sách nhà xuất bản và thông tin liên hệ.
            </p>
          </div>

          <Button
            type="button"
            color="primary"
            className="w-full sm:w-auto cursor-pointer"
            onClick={() => handleOpenSaveModal(null)}
          >
            <Plus size={18} />
            Thêm NXB
          </Button>
        </div>

        {/* FILTER & TABLE */}
        <div className="card-custom">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên nhà xuất bản..."
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>
            <div className="w-full md:w-56">
              <SelectBox<BaseStatus | null>
                options={statusOptions}
                value={status}
                onChange={handleStatusChange}
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

          <PublisherTable
            publishers={filterPublisher}
            onEdit={handleOpenSaveModal}
            onDelete={handleOpenDelete}
          />
          <PublisherMobileCard
            publishers={filterPublisher}
            onEdit={handleOpenSaveModal}
            onDelete={handleOpenDelete}
          />
        </div>

        <Pagination
          currentPage={page}
          totalPages={publishers?.totalPages || 1}
          onPageChange={(p) => setPage(p)}
          totalItems={publishers?.totalItems || 0}
          pageSize={size}
          onPageSizeChange={(s) => {
            setSize(s);
            setPage(1);
          }}
        />
      </div>

      {/* SAVE MODAL */}
      <Modal
        isOpen={openSaveModal}
        onClose={handleCloseSaveModal}
        title={selectItem ? "Cập nhật nhà xuất bản" : "Thêm nhà xuất bản"}
        onConfirm={
          selectItem ? handleSubmit(onSubmitUpdate) : handleSubmit(onSubmitAdd)
        }
        confirmText={selectItem ? "Cập nhật NXB" : "Thêm NXB"}
        cancelText="Hủy"
        size="lg"
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <InputField
            label="Tên nhà xuất bản"
            name="name"
            type="text"
            placeholder="Nhập tên nhà xuất bản..."
            register={register}
            rules={{ required: "Tên nhà xuất bản là bắt buộc" }}
            error={errors?.name}
          />
          <SelectBox<BaseStatus>
            label="Trạng thái"
            options={(Object.values(BaseStatus) as BaseStatus[])

              .filter((statusVal) => statusVal !== "DELETED")
              .map((value) => ({
                label: getBaseStatusLabel(value),
                value,
              }))}
            value={useWatch({ control, name: "status" })}
            onChange={(val) => setValue("status", val)}
            searchable={false}
          />
          <InputField
            label="Địa chỉ"
            name="street"
            type="text"
            placeholder="Nhập địa chỉ nhà xuất bản..."
            register={register}
            error={errors?.street}
          />
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={openDeleteModal}
        onClose={handleCloseDelete}
        title="Xóa nhà xuất bản"
        onConfirm={onSubmitDelete}
        confirmText="Xóa NXB"
        cancelText="Hủy"
      >
        <div className="py-2">
          {selectItem && (
            <p className="text-slate-700 text-base leading-relaxed">
              Bạn có chắc chắn muốn xóa nhà xuất bản{" "}
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
