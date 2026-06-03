import Loading from "@/components/common/Loading";
import {
  useCreateGenre,
  useDeleteGenre,
  useFilterGenre,
  useUpdateGenre,
} from "@/hooks/useGenre";
import {
  GenreStatus,
  GenreStatusLabel,
  type GenreRequest,
} from "@/types/genre";
import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import { Controller, useForm } from "react-hook-form";
import InputField from "@/components/common/InputField";
import { mapServerErrors } from "@/utils/mapServerErrors";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import Pagination from "@/components/common/Pagination";
import type { options as GenreOptions, GenreResponse } from "@/types/genre";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import SelectBox from "@/components/common/SelectedBox";
import {
  Edit,
  Eye,
  Trash2,
  Sparkles,
  Plus,
  RotateCcw,
  Search,
  Layers,
} from "lucide-react";
import imageService from "@/services/imageService";
import GenreTable from "@/components/admin/genre/GenreTable";
import GenreMobileCard from "@/components/admin/genre/GenreMobileCard";

const initialFilterOptions: GenreOptions = {
  keyword: "",
  page: 1,
  size: 10,
};

function getPositiveNumberParam(
  searchParams: URLSearchParams,
  key: string,
  fallback: number,
) {
  const value = Number(searchParams.get(key));
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

export default function Genre() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") ?? initialFilterOptions.keyword,
  );
  const [status, setStatus] = useState<GenreStatus | null>(
    (searchParams.get("status") as GenreStatus) ?? null,
  );
  const debouncedKeyword = useDebounce(keyword, 500);
  const options = useMemo<GenreOptions>(
    () => ({
      keyword: searchParams.get("keyword") ?? initialFilterOptions.keyword,
      status: (searchParams.get("status") as GenreStatus) || undefined,
      page: getPositiveNumberParam(
        searchParams,
        "page",
        initialFilterOptions.page ?? 1,
      ),
      size: getPositiveNumberParam(
        searchParams,
        "size",
        initialFilterOptions.size ?? 10,
      ),
    }),
    [searchParams],
  );
  const { data, isPending, isFetching } = useFilterGenre(options);
  const [file, setFile] = useState<File | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [generatedImageRetry, setGeneratedImageRetry] = useState(0);
  const [generatedImageError, setGeneratedImageError] = useState(false);
  const genres = data?.items ?? [];
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
      status: GenreStatus.ACTIVE,
      previewImageUrl: "",
    },
  });
  const [openAddGenreModal, setOpenAddGenreModal] = useState(false);
  const [openDeleteGenreModal, setOpenDeleteGenreModal] = useState(false);
  const [openUpdateGenreModal, setOpenUpdateGenreModal] = useState(false);
  const [selectGenre, setSelectGenre] = useState<GenreResponse | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const createMutation = useCreateGenre();
  const deleteGenre = useDeleteGenre();
  const updateGenre = useUpdateGenre();

  const onSubmitAddGenre = async (data: GenreRequest) => {
    if (createMutation.isPending) return;
    try {
      const formData = new FormData();

      formData.append(
        "data",
        new Blob([JSON.stringify(data)], {
          type: "application/json",
        }),
      );

      if (file) {
        formData.append("image", file);
      }

      await createMutation.mutateAsync(formData);
      showSuccessToast("Thêm thể loại thành công!");
      reset();
      setFile(null);
      setValue("previewImageUrl", "");
      setGeneratedImageUrl(null);
      setGeneratedImageRetry(0);
      setGeneratedImageError(false);
      handleCloseAddGenreModal();
    } catch (error: unknown) {
      mapServerErrors(error, setError, showErrorToast);
    }
  };
  const onSubmitUpdateGenre = async (data: GenreRequest) => {
    if (updateGenre.isPending) return;
    try {
      await updateGenre.mutateAsync({ id: selectGenre?.id ?? 0, data });
      showSuccessToast("Cập nhật thể loại thành công!");
      reset();
      handleCloseUpdateGenreModal();
    } catch (error: unknown) {
      mapServerErrors(error, setError, showErrorToast);
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

  const handleOpenUpdateGenreModal = (genre: GenreResponse) => {
    setSelectGenre(genre);
    setValue("name", genre.name);
    setValue("status", genre.status);
    setOpenUpdateGenreModal(true);
  };

  const handleCloseAddGenreModal = () => {
    reset();
    setFile(null);
    setGeneratedImageUrl(null);
    setGeneratedImageRetry(0);
    setGeneratedImageError(false);
    setOpenAddGenreModal(false);
  };
  const handleCloseUpdateGenreModal = () => {
    reset();
    setOpenUpdateGenreModal(false);
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
      setValue("previewImageUrl", resp.imageUrl);

      setGeneratedImageUrl(resp.imageUrl);
      setGeneratedImageRetry(0);
      setGeneratedImageError(false);
      showSuccessToast("Tạo ảnh bằng AI thành công!");
    } catch (error) {
      showErrorToast("Lỗi tạo ảnh bằng AI");
      console.error(error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const updateSearchParams = useCallback(
    (nextOptions: GenreOptions, replace = true) => {
      const nextSearchParams = new URLSearchParams(searchParams);
      const nextKeyword = nextOptions.keyword?.trim();

      if (nextKeyword) {
        nextSearchParams.set("keyword", nextKeyword);
      } else {
        nextSearchParams.delete("keyword");
      }

      if (nextOptions.status) {
        nextSearchParams.set("status", nextOptions.status);
      } else {
        nextSearchParams.delete("status");
      }

      nextSearchParams.set(
        "page",
        String(nextOptions.page ?? initialFilterOptions.page),
      );
      nextSearchParams.set(
        "size",
        String(nextOptions.size ?? initialFilterOptions.size),
      );

      setSearchParams(nextSearchParams, { replace });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (debouncedKeyword === options.keyword) return;

    updateSearchParams({
      ...options,
      keyword: debouncedKeyword,
      page: 1,
    });
  }, [debouncedKeyword, options, updateSearchParams]);

  const handleKeywordChange = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleStatusChange = (value: GenreStatus | null) => {
    setStatus(value);
    updateSearchParams({ ...options, status: value ?? undefined, page: 1 }, false);
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ ...options, page }, false);
  };

  const handlePageSizeChange = (size: number) => {
    updateSearchParams({ ...options, page: 1, size }, false);
  };

  const handleResetFilter = () => {
    setKeyword(initialFilterOptions.keyword ?? "");
    setStatus(null);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const statusOptions = useMemo(
    () => [
      { label: "Tất cả trạng thái", value: null as GenreStatus | null },
      ...Object.values(GenreStatus).map((value) => ({
        label: GenreStatusLabel[value],
        value,
      })),
    ],
    [],
  );
  const generatedPreviewUrl = useMemo(() => {
    if (!generatedImageUrl) return "";

    const separator = generatedImageUrl.includes("?") ? "&" : "?";
    return `${generatedImageUrl}${separator}retry=${generatedImageRetry}`;
  }, [generatedImageRetry, generatedImageUrl]);

  if (isPending) return <Loading />;

  return (
    <>
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 transform active:scale-95 cursor-pointer"
            onClick={() => setOpenAddGenreModal(true)}
          >
            <Plus size={18} />
            Thêm thể loại
          </button>
        </div>

        {/* FILTER & TABLE CONTAINER */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên thể loại..."
                value={keyword}
                onChange={(event) => handleKeywordChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {/* Status dropdown */}
            <div className="w-full md:w-56">
              <SelectBox<GenreStatus | null>
              
                options={statusOptions}
                value={status}
                onChange={handleStatusChange}
                searchable={false}
              />
            </div>

            {/* Reset Button */}
            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
              onClick={handleResetFilter}
            >
              <RotateCcw size={16} />
              Làm mới
            </button>
          </div>

          <GenreTable
            genres={genres}
            onEdit={handleOpenUpdateGenreModal}
            onDelete={handleOpenDeleteGenreModal}
          />

          {/* ===================== MOBILE CARD ===================== */}
          
          <GenreMobileCard
            genres={genres}
            onEdit={handleOpenUpdateGenreModal}
            onDelete={handleOpenDeleteGenreModal}
          />
        </div> 

        {/* PAGINATION */}
        <div className="mt-4">
          <Pagination
            currentPage={(data?.page ?? 0) + 1}
            totalPages={Math.max(data?.totalPages ?? 0, 1)}
            onPageChange={handlePageChange}
            totalItems={data?.totalItems || 0}
            pageSize={data?.size || options.size || 10}
            onPageSizeChange={handlePageSizeChange}
            disabled={isFetching}
          />
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={openAddGenreModal}
        onClose={handleCloseAddGenreModal}
        title="Thêm thể loại mới"
        onConfirm={handleSubmit(onSubmitAddGenre)}
        confirmText={
          createMutation.isPending ? "Đang thêm..." : "Thêm thể loại"
        }
        cancelText="Hủy"
        size="lg"
      >
        <div>
          {createMutation.isPending && (
            <Loading />
          )}
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Ảnh đại diện thể loại
              </label>

              <div className="flex gap-2 mb-3">
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
                  {isGeneratingAI
                    ? "Đang tạo ảnh..."
                    : "Tạo ảnh đại diện bằng AI"}
                </button>
              </div>

              {!file && !generatedImageUrl ? (
                <label
                  className="
                    flex cursor-pointer items-center justify-center
                    rounded-2xl border-2 border-dashed
                    border-slate-200 p-8 bg-slate-50/50
                    transition hover:border-indigo-500
                    hover:bg-indigo-50/10
                  "
                >
                  <div className="flex flex-col items-center gap-2 text-sm text-slate-500">
                    <span className="text-4xl filter drop-shadow">📁</span>
                    <span className="font-semibold text-slate-700">
                      Chọn ảnh hoặc kéo thả vào đây
                    </span>
                    <span className="text-xs text-slate-400">
                      Chấp nhận PNG, JPG, WEBP
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setFile(file);
                        setGeneratedImageUrl(null);
                        setGeneratedImageRetry(0);
                        setGeneratedImageError(false);
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="relative group rounded-2xl border border-slate-200 p-2 overflow-hidden bg-slate-50/30">
                  <img
                    src={file ? URL.createObjectURL(file) : generatedPreviewUrl}
                    alt="preview"
                    referrerPolicy="no-referrer"
                    className="h-44 w-full rounded-xl object-cover"
                    onLoad={() => setGeneratedImageError(false)}
                    onError={() => {
                      if (
                        !file &&
                        generatedImageUrl &&
                        generatedImageRetry < 6
                      ) {
                        window.setTimeout(() => {
                          setGeneratedImageRetry((retry) => retry + 1);
                        }, 1500);
                        return;
                      }

                      setGeneratedImageError(true);
                    }}
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-slate-900/40 backdrop-blur-xs transition-all duration-200 rounded-xl flex items-center justify-center gap-3">
                    {generatedImageUrl && !file && (
                      <a
                        href={generatedImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Mở ảnh trong tab mới"
                        className="bg-white p-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition shadow-lg flex items-center justify-center"
                      >
                        <Eye size={18} className="text-slate-700" />
                      </a>
                    )}
                    <label className="bg-white p-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition shadow-lg flex items-center justify-center">
                      <Edit size={18} className="text-slate-700" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            setGeneratedImageUrl(null);
                            setGeneratedImageRetry(0);
                            setGeneratedImageError(false);
                          }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setGeneratedImageUrl(null);
                        setGeneratedImageRetry(0);
                        setGeneratedImageError(false);
                      }}
                      className="bg-rose-500 text-white p-2.5 rounded-xl hover:bg-rose-600 transition shadow-lg flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-2.5 px-1.5 flex justify-between items-center">
                    <p className="text-xs font-semibold text-slate-500 truncate max-w-[80%]">
                      {file?.name ?? "Ảnh được sinh bởi AI"}
                    </p>
                  </div>
                  {generatedImageError && generatedImageUrl && !file && (
                    <a
                      href={generatedImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-xs text-rose-600 underline px-1.5"
                    >
                      Không tải được ảnh. Mở ảnh trong tab mới
                    </a>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal
        isOpen={openUpdateGenreModal}
        onClose={handleCloseUpdateGenreModal}
        title="Cập nhật thể loại"
        onConfirm={handleSubmit(onSubmitUpdateGenre)}
        confirmText="Lưu thay đổi"
        cancelText="Hủy"
        size="lg"
      >
        <div>
          <form className="space-y-4">
            <InputField
              label="Tên thể loại"
              name="name"
              type="text"
              placeholder="Nhập tên thể loại"
              register={register}
              rules={{
                required: "Tên thể loại là bắt buộc",
              }}
              error={errors?.name}
            />
            <Controller
              name="status"
              control={control}
              rules={{ required: "Vui lòng chọn trạng thái" }}
              render={({ field, fieldState }) => (
                <div>
                  <SelectBox<GenreStatus | null>
                    label="Trạng thái"
                    options={statusOptions}
                    value={field.value}
                    onChange={field.onChange}
                    searchable={false}
                  />
                  <p className="text-rose-500 text-xs mt-1">
                    {fieldState.error?.message}
                  </p>
                </div>
              )}
            />
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
