import { useState, useMemo, useCallback } from "react";
import Pagination from "@/components/common/Pagination";
import Loading from "@/components/common/Loading";
import AuthorTable from "@/features/admin/author/components/AuthorTable";
import AuthorMobileCard from "@/features/admin/author/components/AuthorMobileCard";

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
import useAuthorFilter from "@/features/admin/author/hooks/useAuthorFilter";
import AuthorHeader from "@/features/admin/author/components/AuthorHeader";
import AuthorFilter from "@/features/admin/author/components/AuthorFilter";
import AuthorDeleteModal from "@/features/admin/author/components/AuthorDeleteModal";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default function AuthorPage() {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [selectItem, setSelectItem] = useState<AuthorResponse | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
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
  } = useAuthorFilter();

  const { data: authors } = useFilterAuthor({
    keyword: debouncedKeyword,
    status: status || undefined,
    page,
    size,
  });

  const filterAuthor = authors?.items ?? [];

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

      const apiPromise =
        isUpdate && selectItem?.id
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
        <AuthorHeader onCreate={() => handleOpenSaveModal(null)} />

        {/* FILTER & TABLE */}
        <div className="card-custom">
          <AuthorFilter
            keyword={keyword}
            status={status}
            statusOptions={statusOptions}
            onKeywordChange={handleKeywordChange}
            onStatusChange={handleStatusChange}
            onReset={handleResetFilter}
          />

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
      <AuthorDeleteModal
        isOpen={openDeleteModal}
        author={selectItem}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={onSubmitDelete}
      />
    </>
  );
}
