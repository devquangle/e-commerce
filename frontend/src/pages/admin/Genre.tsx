import Loading from "@/components/common/Loading";
import { useCreateGenre, useDeleteGenre, useGenre } from "@/hooks/useGenre";
import {
  GenreStatus,
  GenreStatusLabel,
  type GenreRequest,
} from "@/types/genre";
import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/components/common/Modal";
import { useForm } from "react-hook-form";
import InputField from "@/components/common/InputField";
import { mapServerErrors } from "@/utils/mapServerErrors";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";
import Pagination from "@/components/common/Pagination";
import type { options as GenreOptions, GenreResponse } from "@/types/genre";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";

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

function statusClass(status: GenreStatus) {
  switch (status) {
    case GenreStatus.ACTIVE:
      return "bg-green-100 text-green-700";
    case GenreStatus.INACTIVE:
      return "bg-gray-100 text-gray-600";
    case GenreStatus.DELETED:
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function Genre() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") ?? initialFilterOptions.keyword,
  );
  const debouncedKeyword = useDebounce(keyword, 500);
  const options = useMemo<GenreOptions>(
    () => ({
      keyword: searchParams.get("keyword") ?? initialFilterOptions.keyword,
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
  const { data, isPending, isFetching } = useGenre(options);
  const genres = data?.items ?? [];
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<GenreRequest>({
    defaultValues: {
      name: "",
      status: GenreStatus.ACTIVE,
    },
  });
  const [openAddGenreModal, setOpenAddGenreModal] = useState(false);
  const [openDeleteGenreModal, setOpenDeleteGenreModal] = useState(false);
  const [selectGenre, setSelectGenre] = useState<GenreResponse | null>(null);

  const createMutation = useCreateGenre();
  const deleteGenre = useDeleteGenre();

  const onSubmitAddGenre = async (data: GenreRequest) => {
    if (createMutation.isPending) return;
    try {
      await createMutation.mutateAsync(data);
      showSuccessToast("Thêm thể loại thành công!");
      reset();
      handleCloseAddGenreModal();
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

  const handleCloseAddGenreModal = () => {
    reset();
    setOpenAddGenreModal(false);
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

  const handlePageChange = (page: number) => {
    updateSearchParams({ ...options, page }, false);
  };

  const handlePageSizeChange = (size: number) => {
    updateSearchParams({ ...options, page: 1, size }, false);
  };

  const handleResetFilter = () => {
    setKeyword(initialFilterOptions.keyword ?? "");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  if (isPending) return <Loading />;

  return (
    <>
      <div className="flex-1 p-2">
        {/* HEADER */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý thể loại
            </h1>
            <p className="text-sm text-gray-500">
              Tạo và quản lý danh mục sản phẩm theo nhóm.
            </p>
          </div>

          <button
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            onClick={() => setOpenAddGenreModal(true)}
          >
            + Thêm thể loại
          </button>
        </div>

        {/* FILTER */}
        <div className="mt-4 rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <input
              type="text"
              placeholder="Tìm theo tên thể loại..."
              value={keyword}
              onChange={(event) => handleKeywordChange(event.target.value)}
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />

            <select className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2">
              <option>Tất cả trạng thái</option>
              <option>{GenreStatusLabel[GenreStatus.ACTIVE]}</option>
              <option>{GenreStatusLabel[GenreStatus.INACTIVE]}</option>
              <option>{GenreStatusLabel[GenreStatus.DELETED]}</option>
            </select>

            <button
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={handleResetFilter}
            >
              Làm mới
            </button>
          </div>

          {/* ===================== DESKTOP TABLE ===================== */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[900px]">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2">Tên thể loại</th>
                  <th className="py-2">Số sách</th>
                  <th className="py-2">Trạng thái</th>
                  <th className="py-2 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {genres.map((genre) => (
                  <tr
                    key={genre.id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="py-3 text-gray-700 font-medium">
                      {genre?.name}
                    </td>

                    <td className="py-3 text-gray-700 align-top">
                      <span className="inline-flex items-center justify-center w-8 h-6 text-sm">
                        {genre.totalProduct}
                      </span>
                    </td>

                    <td className="py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${statusClass(genre.status)}`}
                      >
                        {GenreStatusLabel[genre.status]}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="mr-2 rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">
                        Sửa
                      </button>
                      <button
                        onClick={() => handleOpenDeleteGenreModal(genre)}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===================== MOBILE CARD ===================== */}
          <div className="space-y-3 md:hidden">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className="rounded-lg border bg-white p-3 shadow-sm"
              >
                {/* TITLE */}
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-gray-800">
                    {genre?.name}
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusClass(genre.status)}`}
                  >
                    {GenreStatusLabel[genre.status]}
                  </span>
                </div>

                {/* INFO */}
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Số sách:</span>{" "}
                    {genre.totalProduct}
                  </div>
                </div>

                {/* ACTION */}
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded border py-1 text-xs hover:bg-gray-50">
                    Sửa
                  </button>
                  <button
                    onClick={() => handleOpenDeleteGenreModal(genre)}
                    className="flex-1 rounded border border-red-200 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* PAGINATION */}
        <div>
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
      <Modal
        isOpen={openAddGenreModal}
        onClose={handleCloseAddGenreModal}
        title="Thêm thể loại mới"
        onConfirm={handleSubmit(onSubmitAddGenre)}
        confirmText="Thêm"
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
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={openDeleteGenreModal}
        onClose={handleCloseDeleteGenreModal}
        title="Xóa thể loại"
        onConfirm={handleSubmit(onSubmitDeleteGenre)}
        confirmText="Xóa"
        cancelText="Hủy"
        size="lg"
      >
        <div>
          {selectGenre && (
            <p className="text-gray-700 mb-4">
              Bạn sắp xóa thể loại{" "}
              <span className="font-semibold">{selectGenre.name}</span>.
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
