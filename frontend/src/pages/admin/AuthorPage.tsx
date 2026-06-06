import { useState, useMemo, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { useForm, useWatch } from "react-hook-form";
import InputField from "@/components/common/InputField";
import Pagination from "@/components/common/Pagination";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import SelectBox from "@/components/common/SelectedBox";
import { Plus, RotateCcw, Search, Users } from "lucide-react";
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
import type { AuthorReq, AuthorRes } from "@/types/author";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import {
  useCreateAuthor,
  useFilterAuthor,
  useUpdateAuthor,
} from "@/hooks/useAuthor";
import { mapServerErrors } from "@/utils/mapServerErrors";

const initialFilterOptions = { keyword: "", status: "", page: 1, size: 10 };

export default function AuthorPage() {
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
  const [onpenSaveModal, setOpenSaveModal] = useState(false);

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
    setError,
    control,
    formState: { errors },
  } = useForm<AuthorReq>({
    defaultValues: {
      name: "",
      extract: "",
      urlBio: "",
      urlImage: "",
      status: BaseStatus.ACTIVE,
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
    isPending: isPendingAuthor,
    isFetching: isAuthorsFetching,
  } = useFilterAuthor({
    keyword: debouncedKeyword,
    status: status || undefined,
    page,
    size,
  });

  const filterAuthor = authors?.items || [];

  // Handlers
  const handleKeywordChange = (val: string) => {
    setKeyword(val);
    setPage(1);
  };
  const handleStatusChange = (val: any) => {
    setStatus(val);
    setPage(1);
  };
  const handleResetFilter = () => {
    setKeyword("");
    setStatus(null);
    setPage(initialFilterOptions.page);
    setSize(initialFilterOptions.size);
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
    if (selectItem) return;
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
        setValue("extract", wikiData.extract);

        if (wikiData.urlImage) {
          setValue("urlImage", wikiData.urlImage);
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
  }, [wikiData, isWikiFetching, debouncedName, setValue, selectItem]);

  const handleOpenDelete = (item: AuthorRes) => {
    setSelectItem(item);
    setOpenDeleteModal(true);
  };
  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
  };
  const createMutation = useCreateAuthor();
  const updateMutation = useUpdateAuthor();

  const onSubmitAdd = async (req: AuthorReq) => {
    if (createMutation.isPending) return;
    try {
      const payload: AuthorReq = {
        ...req,
        urlImage: avatarUrl || req.urlImage,
      };
      await createMutation.mutateAsync(payload);
      handleCloseSaveModal();
    } catch (error: unknown) {
      mapServerErrors(error, setError, showErrorToast);
    }
  };
  const onSubmitUpdate = async (req: AuthorReq) => {
    if (updateMutation.isPending) return;
    try {
      if (selectItem) {
        const payload: AuthorReq = {
        ...req,
        urlImage: avatarUrl || req.urlImage,
      };
        await updateMutation.mutateAsync({ id: selectItem?.id ?? 0,req: payload });
        handleCloseSaveModal();
      }
    } catch (error: unknown) {
      mapServerErrors(error, setError, showErrorToast);
    }
  };
  const onSubmitDelete = () => {
    alert("Xoá: " + selectItem?.name);
    handleCloseDelete();
  };

  const handleOpenSaveModal = (item: AuthorRes | null) => {
    if (item) {
      setSelectItem(item);
      setValue("name", item.name);
      setValue("extract", item.description);
      setValue("status", item.status);
      setValue("urlBio", item.urlBio || ""); // ✨ Bổ sung đổ lại urlBio cũ vào form
      setValue("urlImage", item.urlImage || "");
      if (item.urlImage) {
        setAvatarUrl(item.urlImage);
        setImageUploadMode("url");
      } else {
        setAvatarUrl("");
        setImageUploadMode("file");
      }
      setFile(null);
      setTempImageUrl("");
    } else {
      reset();
      setFile(null);
      setAvatarUrl("");
      setTempImageUrl("");
      setImageUploadMode("file");
    }
    setOpenSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    reset();
    setSelectItem(null);
    setFile(null);
    setAvatarUrl("");
    setTempImageUrl("");
    setOpenSaveModal(false);
  };

  return (
    <>
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
              Quản lý danh sách tác giả, thông tin và tiểu sử của họ.
            </p>
          </div>

          <Button
            type="button"
            color="primary"
            className="w-full sm:w-auto cursor-pointer"
            onClick={() => handleOpenSaveModal(null)}
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
            onEdit={handleOpenSaveModal}
            onDelete={handleOpenDelete}
          />
          <AuthorMobileCard
            authors={filterAuthor}
            onEdit={handleOpenSaveModal}
            onDelete={handleOpenDelete}
          />
        </div>

        {/* PAGINATION */}
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={authors?.totalPages || 1}
            onPageChange={(p) => setPage(p)}
            totalItems={authors?.totalItems || 0}
            pageSize={size}
            onPageSizeChange={(s) => {
              setSize(s);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* SAVE MODAL */}
      <Modal
        isOpen={onpenSaveModal}
        onClose={handleCloseSaveModal}
        title={selectItem ? "Cập nhật tác giả" : "Thêm tác giả"}
        onConfirm={
          selectItem ? handleSubmit(onSubmitUpdate) : handleSubmit(onSubmitAdd)
        }
        confirmText={selectItem ? "Cập nhật tác giả" : "Thêm tác giả"}
        cancelText="Hủy"
        size="lg"
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
            name="extract"
            placeholder="Nhập mô tả..."
            rows={4}
            register={register}
            error={errors?.extract}
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
