import { useEffect } from "react";
import {
  useForm,
  useWatch,
  type UseFormSetError,
} from "react-hook-form";

import Modal from "@/components/common/Modal";
import Loading from "@/components/common/Loading";
import InputField from "@/components/common/InputField";
import SelectBox from "@/components/common/SelectedBox";
import SingleImageUpload from "@/components/common/SingleImageUpload";

import { Sparkles } from "lucide-react";

import { BaseStatus, getBaseStatusLabel } from "@/types/status";

import type {
  GenreRequest,
  GenreResponse,
} from "../types/genre.type";
import { showInfoToast } from "@/utils/toastUtil";

interface GenreFormModalProps {
  isOpen: boolean;
  onClose: () => void;

  selectItem: GenreResponse | null;

  onSubmit: (
    data: GenreRequest,
    setError: UseFormSetError<GenreRequest>
  ) => Promise<void>;

  file: File | null;
  setFile: React.Dispatch<
    React.SetStateAction<File | null>
  >;

  avatarUrl: string;
  setAvatarUrl: React.Dispatch<
    React.SetStateAction<string>
  >;

  isPending: boolean;

  isGeneratingAI: boolean;
  onGenerateAI: (genreName: string) => Promise<void>;
}

const defaultValues: GenreRequest = {
  name: "",
  previewImageUrl: "",
  status: BaseStatus.ACTIVE,
};

export default function GenreFormModal({
  isOpen,
  onClose,
  selectItem,

  onSubmit,

  file,
  setFile,

  avatarUrl,
  setAvatarUrl,

  isPending,

  isGeneratingAI,
  onGenerateAI,
}: GenreFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<GenreRequest>({
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) return;

    if (selectItem) {
      reset({
        name: selectItem.name,
        status: selectItem.status,
        previewImageUrl: selectItem.urlImage || "",
      });

      setAvatarUrl(selectItem.urlImage || "");
      setFile(null);
    } else {
      reset(defaultValues);
      setAvatarUrl("");
      setFile(null);
    }
  }, [
    isOpen,
    selectItem,
    reset,
    setAvatarUrl,
    setFile,
  ]);
const handleGenerate = async () => {
  const genreName = getValues("name")?.trim();

  if (!genreName) {
    showInfoToast("Vui lòng nhập tên để tạo ảnh!");
    return;
  }

  await onGenerateAI(genreName);
};
  const watchedStatus = useWatch({
    control,
    name: "status",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        selectItem
          ? "Cập nhật thể loại"
          : "Thêm thể loại mới"
      }
      onConfirm={handleSubmit((data) =>
        onSubmit(data, setError)
      )}
      confirmText={
        isPending
          ? "Đang lưu..."
          : selectItem
            ? "Lưu thay đổi"
            : "Thêm thể loại"
      }
      cancelText="Hủy"
      size="lg"
    >
      <div>
        {isPending && <Loading />}

        <form
          className="space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <InputField
            label="Tên thể loại"
            name="name"
            type="text"
            placeholder="Nhập tên thể loại..."
            register={register}
            rules={{
              required: "Tên thể loại là bắt buộc",
            }}
            error={errors.name}
          />

          {selectItem && (
            <SelectBox<BaseStatus>
              label="Trạng thái"
              options={(Object.values(
                BaseStatus
              ) as BaseStatus[])
                .filter(
                  (x) => x !== BaseStatus.DELETED
                )
                .map((value) => ({
                  label: getBaseStatusLabel(value),
                  value,
                }))}
              value={watchedStatus}
              onChange={(value) =>
                setValue("status", value)
              }
              searchable={false}
            />
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Ảnh thể loại
            </label>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGeneratingAI}
              className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 disabled:opacity-50"
            >
              <Sparkles
                size={16}
                className="animate-pulse"
              />

              {isGeneratingAI
                ? "Đang tạo ảnh..."
                : "Tạo ảnh bằng AI"}
            </button>

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
  );
}