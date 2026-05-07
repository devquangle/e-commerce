import Loading from "@/components/common/Loading";
import { useCreateGenre, useGenre } from "@/hooks/useGenre";
import GenreChildren from "./GenreChildren";
import {
  GenreStatus,
  GenreStatusLabel,
  type GenreRequest,
} from "@/types/genre";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import {useForm } from "react-hook-form";
import InputField from "@/components/common/InputField";
import { mapServerErrors } from "@/utils/mapServerErrors";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtil";

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
  const { data: genres = [], isPending } = useGenre();
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
  const [openEditGenreModal, setOpenEditGenreModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const createMutation = useCreateGenre();
  const onSubmitAddGenre = async (data: GenreRequest) => {
    if (createMutation.isPending) return;
    try {
      await createMutation.mutateAsync(data);
      showSuccessToast("Thêm thể loại thành công!");
      handleCloseAddGenreModal();
    } catch (error: unknown) {
      mapServerErrors(error, setError, showErrorToast);
    }
  };
  const handleCloseAddGenreModal = () => {
    reset();
    setSelectedGenre(null);
    setOpenAddGenreModal(false);
  };

  const onSubmitEditGenre = (data: GenreRequest) => {
    console.log("Edit Genre:", data);
    setOpenEditGenreModal(false);
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
              className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2"
            />

            <select className="rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2">
              <option>Tất cả trạng thái</option>
              <option>{GenreStatusLabel[GenreStatus.ACTIVE]}</option>
              <option>{GenreStatusLabel[GenreStatus.INACTIVE]}</option>
              <option>{GenreStatusLabel[GenreStatus.DELETED]}</option>
            </select>

            <button className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
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
                      <button className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
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
                  <button className="flex-1 rounded border border-red-200 py-1 text-xs text-red-600 hover:bg-red-50">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
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
    </>
  );
}
