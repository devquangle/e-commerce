import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, RotateCcw, Search, Users } from "lucide-react";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import SelectBox from "@/components/common/SelectedBox";
import Button from "@/components/common/Button";
import Loading from "@/components/common/Loading";
import AuthorTable from "@/features/admin/author/components/AuthorTable";
import AuthorMobileCard from "@/features/admin/author/components/AuthorMobileCard";

import useDebounce from "@/hooks/useDebounce";
import {
  useCreateAuthor,
  useFilterAuthor,
  useUpdateAuthor,
  useDeleteAuthor,
} from "@/features/admin/author/hooks/useAuthor";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import type { AuthorRequest, AuthorResponse } from "@/types/author";
import { showErrorToast } from "@/utils/toastUtil";
import imageService from "@/services/imageService";
import AuthorFormModal from "@/features/admin/author/components/AuthorFormModal";
import { mapServerErrors } from "@/utils/mapServerErrors";
import type { UseFormSetError } from "react-hook-form"; // Import thêm cái này
const initialFilterOptions = { keyword: "", status: "", page: 1, size: 10 };
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function AuthorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(
    () => searchParams.get("keyword") ?? initialFilterOptions.keyword,
  );
  const [status, setStatus] = useState<BaseStatus | null>(
    () => (searchParams.get("status") as BaseStatus) ?? null,
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
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [selectItem, setSelectItem] = useState<AuthorResponse | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const { data: authors } = useFilterAuthor({
    keyword: debouncedKeyword,
    status: status || undefined,
    page,
    size,
  });

  const filterAuthor = useMemo(() => authors?.items || [], [authors]);

  const statusOptions = useMemo(
    () => [
      { label: "Tất cả trạng thái", value: null },
      ...(Object.values(BaseStatus) as BaseStatus[]).map((value) => ({
        label: getBaseStatusLabel(value),
        value,
      })),
    ],
    [],
  );

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

  const createMutation = useCreateAuthor();
  const updateMutation = useUpdateAuthor();
  const deleteMutation = useDeleteAuthor();

  const processImageUpload = async (currentUrl: string = "") => {
    if (file) {
      const uploadRes = await imageService.uploadFile(file);
      return uploadRes.urlImage;
    }
    if (avatarUrl && avatarUrl !== currentUrl) {
      const uploadRes = await imageService.upload({ url: avatarUrl });
      return uploadRes.urlImage;
    }
    return !avatarUrl ? "" : currentUrl;
  };

  const handleOpenSaveModal = useCallback((item: AuthorResponse | null) => {
    setSelectItem(item);
    setAvatarUrl(item?.urlImage || "");
    setFile(null);
    setOpenSaveModal(true);
  }, []);

  const handleCloseSaveModal = useCallback(() => {
    setOpenSaveModal(false);
    setSelectItem(null);
    setFile(null);
    setAvatarUrl("");
  }, []);

  const handleFormSubmit = async (
    req: AuthorRequest,
    setError: UseFormSetError<AuthorRequest>,
  ) => {
    const isUpdate = !!selectItem;

    try {
      const uploadedImageUrl = await processImageUpload(
        selectItem?.urlImage || "",
      );
      const finalData = { ...req, urlImage: uploadedImageUrl };

      const apiPromise = isUpdate && selectItem?.id
      ? updateMutation.mutateAsync({ id: selectItem.id, req: finalData })
      : createMutation.mutateAsync(finalData);
      await Promise.all([apiPromise, delay(2000)]);
      handleCloseSaveModal();
    } catch (error: unknown) {
      mapServerErrors(error, setError, showErrorToast);
    }
  };

  const onSubmitDelete = async () => {
    if (!selectItem?.id) return;
    await deleteMutation.mutateAsync(selectItem.id);
    setOpenDeleteModal(false);
    setSelectItem(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      {isSubmitting && <Loading />}
      <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Users size={22} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Quản lý tác giả
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Quản lý danh sách tác giả, thông tin và tiểu sử.
            </p>
          </div>
          <Button
            type="button"
            color="primary"
            className="w-full sm:w-auto cursor-pointer"
            onClick={() => handleOpenSaveModal(null)}
          >
            <Plus size={18} /> Thêm tác giả
          </Button>
        </div>

        {/* FILTER & TABLE */}
        <div className="card-custom">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên tác giả..."
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white"
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
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <RotateCcw size={16} /> Làm mới
            </button>
          </div>

          <AuthorTable
            authors={filterAuthor}
            onEdit={handleOpenSaveModal}
            onDelete={(item) => {
              setSelectItem(item);
              setOpenDeleteModal(true);
            }}
            pageSize={size}
            page={page}
          />
          <AuthorMobileCard
            authors={filterAuthor}
            onEdit={handleOpenSaveModal}
            onDelete={(item) => {
              setSelectItem(item);
              setOpenDeleteModal(true);
            }}
          />
        </div>

        <Pagination
          currentPage={page}
          totalPages={authors?.totalPages || 1}
          onPageChange={setPage}
          totalItems={authors?.totalItems || 0}
          pageSize={size}
          onPageSizeChange={(s) => {
            setSize(s);
            setPage(1);
          }}
        />
      </div>

      {/* SAVE MODAL COMPONENT (Đã tách và tối ưu) */}
      <AuthorFormModal
        isOpen={openSaveModal}
        onClose={handleCloseSaveModal}
        selectItem={selectItem}
        onSubmit={handleFormSubmit}
        file={file}
        setFile={setFile}
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
      />

      {/* DELETE MODAL */}
      <Modal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Xóa tác giả"
        onConfirm={onSubmitDelete}
        confirmText="Xóa tác giả"
        cancelText="Hủy"
      >
        <div className="py-2">
          {selectItem && (
            <p className="text-slate-700 text-base">
              Bạn có chắc chắn muốn xóa tác giả{" "}
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
