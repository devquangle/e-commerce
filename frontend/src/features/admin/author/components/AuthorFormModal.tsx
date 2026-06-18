import { useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import Modal from "@/components/common/Modal";
import InputField from "@/components/common/InputField";
import TextAreaField from "@/components/common/TextAreaField";
import SelectBox from "@/components/common/SelectedBox";
import SingleImageUpload from "@/components/common/SingleImageUpload";
import useDebounce from "@/hooks/useDebounce";
import { useWikipediaAuthor } from "@/hooks/useWikipediaAuthor";
import { showSuccessToast } from "@/utils/toastUtil";
import { BaseStatus, getBaseStatusLabel } from "@/types/status";
import type { AuthorRequest, AuthorResponse } from "@/types/author";
import type { UseFormSetError } from "react-hook-form"; // Import thêm cái này
import { useQueryClient } from "@tanstack/react-query"; // 1. Import cái này ở đỉnh file

// Bên trong Component AuthorFormModal:

interface AuthorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectItem: AuthorResponse | null;
  onSubmit: (
    data: AuthorRequest,
    setError: UseFormSetError<AuthorRequest>,
  ) => Promise<void>;
  file: File | null;
  setFile: (file: File | null) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

const initAuthor: AuthorRequest = {
  name: "",
  extract: "",
  urlBio: "",
  wikibaseItem: "",
  urlImage: "",
  status: BaseStatus.ACTIVE,
};

export default function AuthorFormModal({
  isOpen,
  onClose,
  selectItem,
  onSubmit,
  file,
  setFile,
  avatarUrl,
  setAvatarUrl,
}: AuthorFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<AuthorRequest>({ defaultValues: initAuthor });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isOpen) {
      // 2. Khi đóng modal, hủy ngay lập tức các request wikipedia đang chạy ngầm
      queryClient.cancelQueries({ queryKey: ["wikipedia-author"] });
      // (Lưu ý: Thay ["wikipedia-author"] bằng đúng queryKey bạn đặt trong hook useWikipediaAuthor)
    }
  }, [isOpen, queryClient]);

  // Reset form khi đóng/mở hoặc đổi item chọn
// Reset form khi đóng/mở hoặc đổi item chọn
useEffect(() => {
  if (isOpen) {
    if (selectItem) {
      // 1. Khi MỞ chế độ Update -> Đổ dữ liệu cũ vào form
      reset({
        name: selectItem.name,
        extract: selectItem.description || "",
        status: selectItem.status,
        urlBio: selectItem.urlBio || "",
        wikibaseItem: selectItem.wikibaseItem || "",
        urlImage: selectItem.urlImage || "",
      });
    } else {
      // 2. Khi MỞ chế độ Add mới -> Xóa sạch form về mặc định
      reset(initAuthor);
    }
  } else {
    // 🌟 ĐÃ THÊM: Khi ĐÓNG modal (isOpen === false) -> Chủ động reset ngay lập tức!
    reset(initAuthor);
    setAvatarUrl(""); // Đưa ảnh preview về trống
    setFile(null);    // Xóa file ảnh đang chọn dở
  }
}, [isOpen, selectItem, reset, setAvatarUrl, setFile]);

  // useWatch bây giờ CHỈ làm re-render riêng Modal này mà thôi!
  const inputName = useWatch({ control, name: "name" });
  const currentStatus = useWatch({ control, name: "status" });
  const debouncedName = useDebounce(inputName, 1200);

  const shouldFetchWiki = !selectItem && isOpen && !!debouncedName?.trim();

  // Hook gọi Wikipedia tự động chạy dựa theo điều kiện trên
  const { data: wikiData, isFetching: isWikiFetching } = useWikipediaAuthor(
    shouldFetchWiki ? debouncedName : "",
    isOpen,
  );

  const handleSyncToForm = useCallback(() => {
    if (!wikiData) return;
    const currentValues = getValues();
    let updated = false;

    if (!currentValues.urlBio?.trim() && wikiData.urlBio) {
      setValue("urlBio", wikiData.urlBio);
      updated = true;
    }
    if (!currentValues.wikibaseItem?.trim() && wikiData.wikibaseItem) {
      setValue("wikibaseItem", wikiData.wikibaseItem);
      updated = true;
    }
    if (!currentValues.extract?.trim() && wikiData.extract) {
      setValue("extract", wikiData.extract);
      updated = true;
    }
    if (!currentValues.urlImage?.trim() && wikiData.urlImage) {
      setValue("urlImage", wikiData.urlImage);
      setAvatarUrl(wikiData.urlImage);
      setFile(null);
      updated = true;
    }

    showSuccessToast(
      updated
        ? "Đã tự động điền các thông tin còn thiếu từ Wikipedia!"
        : "Các trường thông tin trên Form đã đầy đủ.",
    );
  }, [wikiData, getValues, setValue, setAvatarUrl, setFile]);

  const statusOptions = (Object.values(BaseStatus) as BaseStatus[]).map(
    (value) => ({
      label: getBaseStatusLabel(value),
      value,
    }),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectItem ? "Cập nhật tác giả" : "Thêm tác giả"}
      onConfirm={handleSubmit((data) => onSubmit(data, setError))}
      confirmText={selectItem ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      size="lg"
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="relative w-full">
          <InputField
            label="Tên tác giả"
            name="name"
            type="text"
            placeholder="Nhập tên tác giả để tìm trên Wikipedia..."
            register={register}
            rules={{ required: "Tên tác giả là bắt buộc" }}
            error={errors?.name}
          />
          {shouldFetchWiki && !!inputName?.trim() && isWikiFetching && (
            <div className="absolute right-3 bottom-3 z-10 animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
          )}
        </div>

        {shouldFetchWiki && !!inputName?.trim() &&  wikiData && (
          <div className="mt-2 flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
            <span className="text-xs text-emerald-700">
              Tìm thấy dữ liệu của{" "}
              <strong>{wikiData.name || debouncedName}</strong>!
            </span>
            <button
              type="button"
              onClick={handleSyncToForm}
              className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md cursor-pointer"
            >
              Đồng bộ vào Form
            </button>
          </div>
        )}

        {shouldFetchWiki && !wikiData && !isWikiFetching && (
          <div className="mt-2 p-2.5 bg-amber-50 rounded-lg border border-amber-100 text-xs text-amber-700">
            Không tìm thấy thông tin cho "<strong>{debouncedName}</strong>" trên
            Wikipedia.
          </div>
        )}

        <TextAreaField
          label="Mô tả / Tiểu sử"
          name="extract"
          placeholder="Nhập mô tả..."
          rows={4}
          register={register}
          error={errors?.extract}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Trạng thái
          </label>
          <SelectBox<BaseStatus>
            options={statusOptions}
            value={currentStatus}
            onChange={(val) => setValue("status", val)}
            searchable={false}
          />
        </div>

        <SingleImageUpload
          file={file}
          setFile={setFile}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
        />
      </form>
    </Modal>
  );
}
