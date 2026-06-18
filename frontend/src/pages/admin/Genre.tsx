import Loading from "@/components/common/Loading";
import {
  useCreateGenre,
  useDeleteGenre,
  useFilterGenre,
  useImportGenre,
  useUpdateGenre,
} from "@/hooks/useGenre";
import {
  GenreStatus,
  GenreStatusLabel,
  type GenreRequest,
  type GenreResponse,
} from "@/types/genre";
import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import { useForm, useWatch } from "react-hook-form";
import InputField from "@/components/common/InputField";
import { mapServerErrors } from "@/utils/mapServerErrors";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import Pagination from "@/components/common/Pagination";

import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import SelectBox from "@/components/common/SelectedBox";
import {
  Sparkles,
  Plus,
  RotateCcw,
  Search,
  Layers,
  FileUp,
} from "lucide-react";
import imageService from "@/services/imageService";
import GenreTable from "@/components/admin/genre/GenreTable";
import GenreMobileCard from "@/components/admin/genre/GenreMobileCard";
import Button from "@/components/common/Button";
import SingleImageUpload from "@/components/common/SingleImageUpload";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";

const initialFilterOptions = { keyword: "", status: "", page: 1, size: 10 };

export default function Genre() {
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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    setError,
    formState: { errors },
  } = useForm<GenreRequest>({
    defaultValues: {
      name: "",
      status: BaseStatus.ACTIVE,
      previewImageUrl: "",
    },
  });

  // watch status field for SelectBox value (must be called unconditionally)
  const watchedStatus = useWatch({ control, name: "status" });
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [openDeleteGenreModal, setOpenDeleteGenreModal] = useState(false);
  const [selectGenre, setSelectGenre] = useState<GenreResponse | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  // TỐI ƯU: Sử dụng useCallback cho các Filter Handlers để tránh re-render Table
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

  const onSubmitSave = async (data: GenreRequest) => {
    if (createMutation.isPending || updateGenre.isPending) return;
    try {
      data.previewImageUrl = avatarUrl;

      if (selectGenre) {
        const uploadedImageUrl = await processImageUpload(
          selectGenre.urlImage || "",
        );
        await updateGenre.mutateAsync({
          id: selectGenre.id,
          data: { ...data, previewImageUrl: uploadedImageUrl },
        });
        showSuccessToast("Cập nhật thể loại thành công!");
      } else {
        const formData = new FormData();
        formData.append(
          "data",
          new Blob([JSON.stringify(data)], { type: "application/json" }),
        );
        if (file) formData.append("image", file);
        await createMutation.mutateAsync(formData);
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
      // Khớp đúng key "file" với cấu hình @RequestPart bên Backend Spring Boot
      formData.append("file", uploadedFile);

      // Gọi API import
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

  const handleGenerateImageWithAI = async () => {
    const genreName = getValues("name")?.trim();

    if (!genreName) {
      setError("name", {
        type: "manual",
        message: "Vui lòng nhập tên thể loại trước khi tạo ảnh",
      });
      return;
    }

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
    reset();
    setOpenDeleteGenreModal(false);
  };

  const handleOpenDeleteGenreModal = (genre: GenreResponse) => {
    setSelectGenre(genre);
    setOpenDeleteGenreModal(true);
  };

  const handleOpenSaveModal = (genre: GenreResponse | null) => {
    if (genre) {
      setSelectGenre(genre);
      reset({
        name: genre.name,
        status: genre.status,
        previewImageUrl: genre.urlImage || "",
      });
      setAvatarUrl(genre.urlImage || "");
      setFile(null);
    } else {
      setSelectGenre(null);
      reset({
        name: "",
        status: GenreStatus.ACTIVE,
        previewImageUrl: "",
      });
      setAvatarUrl("");
      setFile(null);
    }
    setOpenSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    reset();
    setFile(null);
    setAvatarUrl("");
    setOpenSaveModal(false);
  };

  const statusOptions = useMemo(
    () => [
      { label: "Tất cả trạng thái", value: null as BaseStatus | null },
      ...Object.values(BaseStatus).map((value) => ({
        label: GenreStatusLabel[value],
        value,
      })),
    ],
    [],
  );

  if (isPending) return <Loading />;

  return (
    <>
      <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max ">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between card-custom">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Layers size={22} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Quản lý thể loại
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Phân loại sách và quản lý các danh mục sản phẩm của cửa hàng.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition shadow flex-1 sm:flex-none flex justify-center items-center gap-2 cursor-pointer">
                <FileUp size={16} />
                Import Excel
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={(e) => {
                    const targetFile = e.target.files?.[0];
                    if (targetFile) {
                      handleImportGenre(targetFile);
                    }
                    e.target.value = "";
                  }}
                />
              </label>
              <Button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow flex-1 sm:flex-none flex justify-center"
                onClick={() => handleOpenSaveModal(null)}
                icon={Plus}
              >
                Thêm mới
              </Button>
            </div>
          </div>
        </div>
        <div className="card-custom">
          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4 md:items-center">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên thể loại..."
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div className="w-full">
              <SelectBox<BaseStatus | null>
                options={statusOptions}
                value={status}
                onChange={handleStatusChange}
                searchable={false}
              />
            </div>

            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer w-full"
              onClick={handleResetFilter}
            >
              <RotateCcw size={16} />
              Làm mới
            </button>
          </div>

          <GenreTable
            genres={filterGenre}
            onEdit={handleOpenSaveModal}
            onDelete={handleOpenDeleteGenreModal}
          />

          {/* MOBILE CARD */}
          <GenreMobileCard
            genres={filterGenre}
            onEdit={handleOpenSaveModal}
            onDelete={handleOpenDeleteGenreModal}
          />
        </div>

        {/* PAGINATION */}
        <div className="w-full">
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
      </div>

      {/* SAVE MODAL (ADD & UPDATE) */}
      <Modal
        isOpen={openSaveModal}
        onClose={handleCloseSaveModal}
        title={selectGenre ? "Cập nhật thể loại" : "Thêm thể loại mới"}
        onConfirm={handleSubmit(onSubmitSave)}
        confirmText={
          createMutation.isPending || updateGenre.isPending
            ? "Đang lưu..."
            : selectGenre
              ? "Lưu thay đổi"
              : "Thêm thể loại"
        }
        cancelText="Hủy"
        size="lg"
      >
        <div>
          {(createMutation.isPending || updateGenre.isPending) && <Loading />}
          <form className="space-y-4">
            <InputField
              label="Tên thể loại"
              name="name"
              type="text"
              placeholder="Nhập tên thể loại ví dụ: Khoa học viễn tưởng..."
              register={register}
              rules={{
                required: "Tên thể loại là bắt buộc",
              }}
              error={errors?.name}
            />
            {selectGenre && (
              <SelectBox<BaseStatus>
                label="Trạng thái"
                options={(Object.values(BaseStatus) as BaseStatus[])

                  .filter((statusVal) => statusVal !== "DELETED")
                  .map((value) => ({
                    label: getBaseStatusLabel(value),
                    value,
                  }))}
                value={watchedStatus}
                onChange={(val) => setValue("status", val)}
                searchable={false}
              />
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Ảnh thể loại
              </label>

              <div className="flex gap-2 mb-1">
                <button
                  type="button"
                  onClick={handleGenerateImageWithAI}
                  disabled={isGeneratingAI}
                  className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Sparkles
                    size={16}
                    className="animate-pulse text-indigo-500"
                  />
                  {isGeneratingAI ? "Đang tạo ảnh..." : "Tạo ảnh bằng AI"}
                </button>
              </div>

              <SingleImageUpload
                file={file}
                setFile={setFile}
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
              />
            </div>
          </form>
        </div>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={openDeleteGenreModal}
        onClose={handleCloseDeleteGenreModal}
        title="Xóa thể loại"
        onConfirm={handleSubmit(onSubmitDeleteGenre)}
        confirmText="Xóa thể loại"
        cancelText="Hủy"
        size="lg"
      >
        <div className="py-2">
          {selectGenre && (
            <p className="text-slate-700 text-base leading-relaxed">
              Bạn có chắc chắn muốn xóa thể loại{" "}
              <span className="font-bold text-slate-900">
                "{selectGenre.name}"
              </span>
              ?
              <br />
              <span className="text-sm text-rose-500 mt-2 block font-medium">
                Lưu ý: Hành động này không thể hoàn tác và có thể ảnh hưởng đến
                các sản phẩm thuộc thể loại này.
              </span>
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
