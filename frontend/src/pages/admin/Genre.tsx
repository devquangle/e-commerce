import Loading from "@/components/common/Loading";

import { useState } from "react";
import type { UseFormSetError } from "react-hook-form";
import { mapServerErrors } from "@/utils/mapServerErrors";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/utils/toastUtil";
import Pagination from "@/components/common/Pagination";

import imageService from "@/services/imageService";

import {
  useCreateGenre,
  useDeleteGenre,
  useFilterGenre,
  useImportGenre,
  useUpdateGenre,
} from "@/features/admin/genre/hooks/useGenre";
import type {
  GenreRequest,
  GenreResponse,
} from "@/features/admin/genre/types/genre.type";
import GenreTable from "@/features/admin/genre/components/GenreTable";
import GenreMobileCard from "@/features/admin/genre/components/GenreMobileCard";
import useGenreFilter from "@/features/admin/genre/hooks/useGenreFilter";
import GenreDeleteModal from "@/features/admin/genre/components/GenreDeleteModal";
import GenreHeader from "@/features/admin/genre/components/GenreHeader";
import GenreFilter from "@/features/admin/genre/components/GenreFilter";
import GenreFormModal from "@/features/admin/genre/components/GenreFormModal";

export default function Genre() {
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
  } = useGenreFilter();
  const {
    data: genres,
    isPending,
    isFetching,
  } = useFilterGenre({
    keyword: debouncedKeyword,
    status: status || undefined,
    page,
    size,
  });

  const filterGenre = genres?.items || [];

  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [openDeleteGenreModal, setOpenDeleteGenreModal] = useState(false);
  const [selectGenre, setSelectGenre] = useState<GenreResponse | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  // TỐI ƯU: Sử dụng useCallback cho các Filter Handlers để tránh re-render Table

  const createMutation = useCreateGenre();
  const deleteGenre = useDeleteGenre();
  const updateGenre = useUpdateGenre();
  const importGenre = useImportGenre();

  const processImageUpload = async (currentUrl: string = "") => {
    if (file) {
      const uploadRes = await imageService.uploadFile(file);
      return uploadRes.urlImage;
    }
    if (avatarUrl && avatarUrl !== currentUrl) {
      const uploadRes = await imageService.upload({ url: avatarUrl });
      return uploadRes.urlImage;
    }
    if (!avatarUrl && currentUrl) {
      return "";
    }
    return currentUrl;
  };

  const onSubmitSave = async (
    data: GenreRequest,
    setError: UseFormSetError<GenreRequest>,
  ) => {
    if (createMutation.isPending || updateGenre.isPending) return;

    try {
      if (selectGenre) {
        const uploadedImageUrl = await processImageUpload(
          selectGenre.urlImage || "",
        );

        await updateGenre.mutateAsync({
          id: selectGenre.id,
          req: {
            ...data,
            previewImageUrl: uploadedImageUrl,
          },
        });

        showSuccessToast("Cập nhật thể loại thành công!");
      } else {
        const uploadedImageUrl = await processImageUpload();

        await createMutation.mutateAsync({
          ...data,
          previewImageUrl: uploadedImageUrl,
        });

        showSuccessToast("Thêm thể loại thành công!");
      }

      handleCloseSaveModal();
    } catch (error: unknown) {
      mapServerErrors(error, setError, showErrorToast);
    }
  };

  const handleImportGenre = async (uploadedFile: File | null | undefined) => {
    if (!uploadedFile) return;
    if (importGenre.isPending) return;

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      await importGenre.mutateAsync(formData);

      showSuccessToast(
        `Import danh sách từ file "${uploadedFile.name}" thành công v!`,
      );
    } catch (error: unknown) {
      showErrorToast(
        "Lỗi khi import file Excel! Vui lòng kiểm tra lại cấu trúc file.",
      );
      console.error("Import Excel Error: ", error);
    }
  };

  const handleGenerateImageWithAI = async (genreName: string) => {
    setIsGeneratingAI(true);

    try {

  
      const resp = await imageService.createImage({
        input: genreName,
      });

      setAvatarUrl(resp.imageUrl);
      setFile(null);

      showSuccessToast("Tạo ảnh bằng AI thành công!");
    } catch (error) {
      showErrorToast("Lỗi tạo ảnh bằng AI");
      console.error(error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const onSubmitDeleteGenre = async () => {
    deleteGenre.mutate(selectGenre?.id ?? 0, {
      onSuccess: () => {
        showSuccessToast("Xóa thể loại thành công!");
        handleCloseDeleteGenreModal();
      },
      onError: (error: unknown) => {
        mapServerErrors(error, () => {}, showErrorToast);
      },
    });
  };

  const handleCloseDeleteGenreModal = () => {
    setSelectGenre(null);
    setOpenDeleteGenreModal(false);
  };

  const handleOpenDeleteGenreModal = (genre: GenreResponse) => {
    setSelectGenre(genre);
    setOpenDeleteGenreModal(true);
  };

  const handleOpenSaveModal = (genre: GenreResponse | null) => {
    setSelectGenre(genre);

    if (!genre) {
      setAvatarUrl("");
      setFile(null);
    }

    setOpenSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setSelectGenre(null);
    setFile(null);
    setAvatarUrl("");
    setOpenSaveModal(false);
  };

  if (isPending) return <Loading />;

  return (
    <>
      <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max ">
        <GenreHeader
          onCreate={() => handleOpenSaveModal(null)}
          onImport={handleImportGenre}
        />
        <div className="card-custom">
          <GenreFilter
            keyword={keyword}
            status={status}
            onKeywordChange={handleKeywordChange}
            onStatusChange={handleStatusChange}
            onReset={handleResetFilter}
          />

          <GenreTable
            genres={filterGenre}
            onEdit={handleOpenSaveModal}
            onDelete={handleOpenDeleteGenreModal}
            pageSize={size}
            page={page}
          />

          {/* MOBILE CARD */}
          <GenreMobileCard
            genres={filterGenre}
            onEdit={handleOpenSaveModal}
            onDelete={handleOpenDeleteGenreModal}
          />
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={page}
          totalPages={genres?.totalPages || 1}
          onPageChange={setPage}
          totalItems={genres?.totalItems || 0}
          pageSize={size}
          onPageSizeChange={(s) => {
            setSize(s);
            setPage(1);
          }}
        />
      </div>

      {/* SAVE MODAL (ADD & UPDATE) */}
      <GenreFormModal
        isOpen={openSaveModal}
        onClose={handleCloseSaveModal}
        selectItem={selectGenre}
        onSubmit={onSubmitSave}
        file={file}
        setFile={setFile}
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
        isPending={createMutation.isPending || updateGenre.isPending}
        isGeneratingAI={isGeneratingAI}
      onGenerateAI={handleGenerateImageWithAI}
      />

      {/* DELETE MODAL */}
      <GenreDeleteModal
        isOpen={openDeleteGenreModal}
        genre={selectGenre}
        onClose={handleCloseDeleteGenreModal}
        onConfirm={onSubmitDeleteGenre}
      />
    </>
  );
}
