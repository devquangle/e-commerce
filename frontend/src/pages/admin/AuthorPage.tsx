import { useState, useMemo, useEffect, useCallback } from "react";
import Modal from "@/components/common/Modal";
import { useForm, Controller, useWatch, set } from "react-hook-form";
import InputField from "@/components/common/InputField";
import Pagination from "@/components/common/Pagination";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import SelectBox from "@/components/common/SelectedBox";
import {
  Plus,
  RotateCcw,
  Search,
  Users,
  Edit,
  Trash2,
  Eye,
  Wand2,
  Upload,
} from "lucide-react";
import AuthorTable from "@/components/admin/author/AuthorTable";
import AuthorMobileCard from "@/components/admin/author/AuthorMobileCard";
import Button from "@/components/common/Button";
import { useWikipediaAuthor } from "@/hooks/useWikipediaAuthor";
import TextAreaField from "@/components/common/TextAreaField";
import {
  dismissToast,
  showErrorToast,
  showInfoToast,
  showSuccessToast,
  showWarningToast,
} from "@/utils/toastUtil";
import SingleImageUpload from "@/components/common/SingleImageUpload";
import type { AuthorRes } from "@/types/author";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import { useFilterAuthor } from "@/hooks/useAuthor";

const initialFilterOptions = { keyword: "", status: "", page: 1, size: 10 };

export default function AuthorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") ?? initialFilterOptions.keyword,
  );
  const [status, setStatus] = useState<BaseStatus | null>(
    (searchParams.get("status") as BaseStatus) ?? null,
  );
  const debouncedKeyword = useDebounce(keyword, 500);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectItem, setSelectItem] = useState<AuthorRes | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">(
    "file",
  );
  const [tempImageUrl, setTempImageUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      urlBio: "",
      urlImage: "",
      status: "ACTIVE",
    },
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

  const {
    data: authors,
    isPending,
    isFetching: isAuthorsFetching,
  } = useFilterAuthor();

  const filterAuthor = authors?.items || [];
  // Handlers
  const handleKeywordChange = (val: string) => setKeyword(val);
  const handleStatusChange = (val: any) => setStatus(val);
  const handleResetFilter = () => {
    setKeyword("");
    setStatus(null);
    setSearchParams(new URLSearchParams());
  };

  const handleAddImageUrl = () => {
    if (!tempImageUrl.trim()) return;
    try {
      const url = new URL(tempImageUrl.trim());
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      showWarningToast("URL ảnh không hợp lệ.");
      return;
    }
    setAvatarUrl(tempImageUrl.trim());
    setFile(null);
    setTempImageUrl("");
  };

  const inputName = useWatch({ control, name: "name" });
  const debouncedName = useDebounce(inputName, 2000);
  const { data: wikiData, isFetching: isWikiFetching } =
    useWikipediaAuthor(debouncedName);

  useEffect(() => {
    const wikiToastId = "wiki-status";

    if (isWikiFetching && debouncedName) {
      showInfoToast("Đang tìm kiếm thông tin trên Wikipedia...", {
        id: wikiToastId,
      });
      return;
    }

    if (!isWikiFetching) {
      if (wikiData) {
        setValue("urlBio", wikiData.urlBio);
        setValue("description", wikiData.extract);

        if (wikiData.urlImage) {
          setAvatarUrl(wikiData.urlImage);
          setImageUploadMode("url");
          setFile(null);
        }

        dismissToast(wikiToastId);
        showSuccessToast("Thông tin đã được điền");
      } else if (debouncedName?.trim()) {
        dismissToast(wikiToastId);
        showErrorToast("Lỗi không tìm thấy thông tin tác giả " + debouncedName);
      } else {
        dismissToast(wikiToastId);
      }
    }
  }, [wikiData, isWikiFetching, debouncedName, setValue]);

  const handleOpenAdd = () => {
    reset();
    setFile(null);
    setAvatarUrl("");
    setTempImageUrl("");
    setImageUploadMode("file");
    setOpenAddModal(true);
  };
  const handleCloseAdd = () => {
    reset();
    setFile(null);
    setAvatarUrl("");
    setTempImageUrl("");
    setOpenAddModal(false);
  };

  const handleOpenUpdate = (item: Author) => {
    setSelectItem(item);
    setValue("name", item.name);
    setValue("description", item.description);
    setValue("status", item.status);
    if (item.avatarUrl) {
      setAvatarUrl(item.avatarUrl);
      setImageUploadMode("url");
    } else {
      setAvatarUrl("");
      setImageUploadMode("file");
    }
    setFile(null);
    setTempImageUrl("");
    setOpenUpdateModal(true);
  };
  const handleCloseUpdate = () => {
    reset();
    setFile(null);
    setAvatarUrl("");
    setTempImageUrl("");
    setOpenUpdateModal(false);
  };

  const handleOpenDelete = (item: Author) => {
    setSelectItem(item);
    setOpenDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
  };

  const onSubmitAdd = (data: any) => {
    alert("Thêm: " + JSON.stringify({ ...data, file: file?.name, avatarUrl }));
    handleCloseAdd();
  };
  const onSubmitUpdate = (data: any) => {
    alert("Sửa: " + JSON.stringify({ ...data, file: file?.name, avatarUrl }));
    handleCloseUpdate();
  };
  const onSubmitDelete = () => {
    alert("Xoá: " + selectItem?.name);
    handleCloseDelete();
  };

  return (
    <>
      <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max ">
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
              Quản lý danh sách tác giả, thông tin và tiểu sử của họ.
            </p>
          </div>

          <Button
            type="button"
            color="primary"
            className="w-full sm:w-auto cursor-pointer"
            onClick={handleOpenAdd}
          >
            <Plus size={18} />
            Thêm tác giả
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

          <AuthorTable
            authors={filterAuthor}
            onEdit={handleOpenUpdate}
            onDelete={handleOpenDelete}
          />
          <AuthorMobileCard
            authors={filterAuthor}
            onEdit={handleOpenUpdate}
            onDelete={handleOpenDelete}
          />
        </div>

        {/* PAGINATION */}
        <div className="mt-4">
          <Pagination
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            totalItems={filterAuthor.length}
            pageSize={10}
            onPageSizeChange={() => {}}
          />
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={openAddModal}
        onClose={handleCloseAdd}
        title="Thêm tác giả mới"
        onConfirm={handleSubmit(onSubmitAdd)}
        confirmText="Thêm tác giả"
        cancelText="Hủy"
        size="lg"
      >
        <form className="space-y-4">
          <InputField
            label="Tên tác giả"
            name="name"
            type="text"
            placeholder="Nhập tên tác giả để tìm kiếm trên Wikipedia..."
            register={register}
            rules={{ required: "Tên tác giả là bắt buộc" }}
            error={errors?.name}
          />

          <TextAreaField
            label="Mô tả / Tiểu sử"
            name="description"
            placeholder="Nhập mô tả..."
            rows={4}
            register={register}
            error={errors?.description}
          />

          <SingleImageUpload
            file={file}
            setFile={setFile}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
          />
        </form>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal
        isOpen={openUpdateModal}
        onClose={handleCloseUpdate}
        title="Cập nhật tác giả"
        onConfirm={handleSubmit(onSubmitUpdate)}
        confirmText="Lưu thay đổi"
        cancelText="Hủy"
        size="lg"
      >
        <form className="space-y-4">
          <InputField
            label="Tên tác giả"
            name="name"
            type="text"
            placeholder="Nhập tên tác giả"
            register={register}
            rules={{ required: "Tên tác giả là bắt buộc" }}
            error={errors?.name}
          />
          <InputField
            label="Mô tả / Tiểu sử"
            name="description"
            type="text"
            placeholder="Nhập mô tả..."
            register={register}
            error={errors?.description}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectBox
                options={statusOptions.filter((o) => o.value !== null)}
                value={field.value}
                onChange={field.onChange}
                searchable={false}
                label="Trạng thái"
              />
            )}
          />

          <SingleImageUpload
            file={file}
            setFile={setFile}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
          />
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={openDeleteModal}
        onClose={handleCloseDelete}
        title="Xóa tác giả"
        onConfirm={onSubmitDelete}
        confirmText="Xóa tác giả"
        cancelText="Hủy"
      >
        <div className="py-2">
          {selectItem && (
            <p className="text-slate-700 text-base leading-relaxed">
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
