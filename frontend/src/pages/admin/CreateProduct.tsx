import { useState, useMemo } from "react";
import ProductDescriptionEditor from "../../components/admin/ProductDescriptionEditor";
import SelectedMutil from "@/components/common/SelectedMutil";
import {
  BookOpen,
  Save,
  Trash2,
  DollarSign,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Upload,
  Eye,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { AuthorResponse } from "@/types/author";
import type { GenreResponse } from "@/types/genre";
import SelectBox from "@/components/common/SelectedBox";
import { Controller, useForm, useWatch } from "react-hook-form";
import InputField from "@/components/common/InputField";
import { showWarningToast } from "@/utils/toastUtil";
import Button from "@/components/common/Button";
import { useBookFormData } from "@/hooks/useBookFormData";

type Serries = {
  id: number;
  name: string;
};

type CoverImage = {
  file?: File;
  url: string;
  isThumbnail: boolean;
};

type CreateBookForm = {
  name: string;
  authorIds: number[];
  publisherId: number | undefined;
  genreIds: number[];
  weight: number;
  publishYear: string;
  pages: number;
  price: number;
  originalPrice: number;
  quantity: number;
  status: "INACTIVE" | "ACTIVE";
  seriesId: number | undefined;

  coverImages: CoverImage[];
  description: string;
};

const seriesData: Serries[] = [
  { id: 1, name: "Sách kỹ năng sống" },
  { id: 2, name: "Sách văn học" },
  { id: 3, name: "Sách lịch sử" },
  { id: 4, name: "Sách khoa học" },
  { id: 5, name: "Sách ngoại ngữ" },
  { id: 6, name: "Sách kinh tế" },
  { id: 7, name: "Sách tâm lý" },
  { id: 8, name: "Sách thiếu nhi" },
  { id: 9, name: "Sách văn hóa" },
  { id: 10, name: "Naruto" },
  { id: 11, name: "One Piece" },
  { id: 12, name: "Dragon Ball" },
];

const initialForm: CreateBookForm = {
  name: "",
  authorIds: [],
  publisherId: undefined,
  genreIds: [],
  weight: 500,
  publishYear: "2020-01-01",
  pages: 200,
  originalPrice: 200000,
  price: 190000,
  seriesId: undefined,
  quantity: 10,
  status: "ACTIVE",
  coverImages: [] as CoverImage[],
  description: `<h4><strong>Giới Thiệu Sách</strong></h4><p>Nhập phần giới thiệu ngắn gọn về cuốn sách tại đây.</p>`,
};

export default function CreateProduct() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    trigger,
    formState: { errors },
  } = useForm<CreateBookForm>({
    defaultValues: initialForm,
    mode: "onChange",
  });

  const {
    genresData = [],
    authorsData = [],
    publishersData = [],
    isLoading,
    isError,
  } = useBookFormData();

  const MAX_IMAGES = 6;
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");

  const coverImages = useWatch({ name: "coverImages", control }) || [];
  const description = useWatch({ control, name: "description" });

  const genreOptions = useMemo(
    () => genresData.map((g: GenreResponse) => ({ label: g.name, value: g.id })),
    [genresData]
  );
  const authorOptions = useMemo(
    () => authorsData.map((a: AuthorResponse) => ({ label: a.displayName, value: a.id })),
    [authorsData]
  );
  const publisherOptions = useMemo(
    () => publishersData.map((p) => ({ label: p.displayName, value: p.id })),
    [publishersData]
  );
  const seriesOptions = useMemo(
    () => seriesData.map((s) => ({ label: s.name, value: s.id })),
    []
  );

  const onSubmit = (data: CreateBookForm) => {
    if (coverImages.length === 0) {
      showWarningToast("Vui lòng thêm ít nhất một ảnh sản phẩm!");
      return;
    }
    console.log("Dữ liệu form hợp lệ:", data);
  };

  const onError = (formErrors: any) => {
    console.error("Form chứa các lỗi sau:", formErrors);
    showWarningToast("Vui lòng kiểm tra lại các trường thông tin bị nhập sai hoặc thiếu!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (coverImages.length >= MAX_IMAGES) {
      showWarningToast(`Bạn chỉ được phép tải lên tối đa ${MAX_IMAGES} hình ảnh.`);
      e.target.value = "";
      return;
    }

    const availableSlots = MAX_IMAGES - coverImages.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);

    const newImages: CoverImage[] = filesToUpload.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isThumbnail: false,
    }));

    const hasThumbnail = coverImages.some((img) => img.isThumbnail);
    if (!hasThumbnail && newImages.length > 0) {
      newImages[0].isThumbnail = true;
    }

    setValue("coverImages", [...coverImages, ...newImages], {
      shouldDirty: true,
      shouldValidate: true,
    });
    e.target.value = "";
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;

    if (coverImages.length >= MAX_IMAGES) {
      showWarningToast(`Danh sách đã đạt tối đa ${MAX_IMAGES} hình ảnh.`);
      return;
    }

    const newImage: CoverImage = {
      url: imageUrl.trim(),
      isThumbnail: coverImages.length === 0 || !coverImages.some((img) => img.isThumbnail),
    };

    setValue("coverImages", [...coverImages, newImage], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setImageUrl("");
  };

  const handleSetThumbnail = (index: number) => {
    setValue(
      "coverImages",
      coverImages.map((img, i) => ({ ...img, isThumbnail: i === index })),
      { shouldDirty: true }
    );
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = coverImages[index];
    if (imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    const updatedImages = coverImages.filter((_, i) => i !== index);
    if (imageToRemove.isThumbnail && updatedImages.length > 0) {
      updatedImages[0].isThumbnail = true;
    }

    setValue("coverImages", updatedImages, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleReset = () => {
    reset(initialForm);
  };

  if (isLoading) return <div className="p-6 text-center">Đang tải dữ liệu form...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Có lỗi xảy ra khi tải dữ liệu.</div>;

  return (
    <form
      id="create-product-form"
      onSubmit={handleSubmit(onSubmit, onError)}
      className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch"
    >
      {/* HEADER ACTIONS */}
      <div className="col-span-12 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              to="/admin/products"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Thêm sách mới
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" color="secondary" className="w-full sm:w-auto">
              <Eye size={15} /> Xem nháp
            </Button>
            <Button type="button" onClick={handleReset} color="warning" className="w-full sm:w-auto">
              <RotateCcw size={15} /> Đặt lại
            </Button>
            <Button type="submit" color="primary" className="w-full sm:w-auto">
              <Save size={15} /> Lưu
            </Button>
          </div>
        </div>
      </div>

      {/* LEFT COLUMN: BASIC INFO */}
      {/* 🛠 SỬA ĐỔI: Sử dụng xl:h-full và xl:col-span-8 để chỉ kéo dãn trên desktop */}
      <div className="col-span-12 xl:col-span-8 space-y-6 xl:h-full">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 xl:h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <BookOpen size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Thông tin sách cơ bản
              </h2>
            </div>

            <div className="grid gap-4 mt-4">
              <InputField
                label="Tên sách"
                name="name"
                type="text"
                placeholder="Nhập tên sách.."
                register={register}
                rules={{ required: "Tên sách là bắt buộc" }}
                error={errors?.name}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Giá nhập */}
                <InputField
                  label="Giá nhập"
                  name="originalPrice"
                  type="number"
                  placeholder="Nhập giá nhập.."
                  register={register}
                  rules={{
                    required: "Giá nhập là bắt buộc",
                    valueAsNumber: true,
                    min: { value: 0, message: "Giá nhập phải lớn hơn hoặc bằng 0" },
                    validate: (value) => {
                      const price = getValues("price");
                      if (!price || Number.isNaN(price)) return true;
                      return Number(value) <= Number(price) || "Giá nhập không được lớn hơn giá bán";
                    },
                    onChange: () => trigger("price"),
                  }}
                  error={errors.originalPrice}
                />

                {/* Giá bán */}
                <InputField
                  label="Giá bán"
                  name="price"
                  type="number"
                  placeholder="Nhập giá bán.."
                  register={register}
                  rules={{
                    required: "Giá bán là bắt buộc",
                    valueAsNumber: true,
                    min: { value: 0, message: "Giá bán phải lớn hơn hoặc bằng 0" },
                    validate: (value) => {
                      const originalPrice = getValues("originalPrice");
                      if (!originalPrice || Number.isNaN(originalPrice)) return true;
                      return Number(value) >= Number(originalPrice) || "Giá bán không được nhỏ hơn giá nhập";
                    },
                    onChange: () => trigger("originalPrice"),
                  }}
                  error={errors.price}
                />

                <InputField
                  label="Số lượng"
                  name="quantity"
                  type="number"
                  placeholder="Nhập số lượng.."
                  register={register}
                  rules={{
                    required: "Số lượng là bắt buộc",
                    valueAsNumber: true,
                    min: { value: 0, message: "Số lượng phải lớn hơn hoặc bằng 0" },
                  }}
                  error={errors?.quantity}
                />

                <InputField
                  label="Số trang"
                  name="pages"
                  type="number"
                  placeholder="Nhập số trang.."
                  register={register}
                  error={errors?.pages}
                />
                <InputField
                  label="Trọng lượng (g)"
                  name="weight"
                  type="number"
                  placeholder="Nhập trọng lượng.."
                  register={register}
                  error={errors?.weight}
                />
                <InputField
                  label="Ngày xuất bản"
                  name="publishYear"
                  type="date"
                  register={register}
                  error={errors?.publishYear}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <SelectBox<"ACTIVE" | "INACTIVE">
                      searchable={false}
                      label="Trạng thái"
                      options={[
                        { label: "Hoạt động", value: "ACTIVE" },
                        { label: "Không hoạt động", value: "INACTIVE" },
                      ]}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: TAXONOMY */}
      {/* 🛠 SỬA ĐỔI: Sử dụng xl:h-full và xl:col-span-4 */}
      <div className="col-span-12 xl:col-span-4 space-y-6 xl:h-full">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 xl:h-full">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <DollarSign size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Thuộc tính</h2>
          </div>

          <div className="space-y-5">
            <Controller
              name="genreIds"
              control={control}
              rules={{ required: "Vui lòng chọn thể loại" }}
              render={({ field, fieldState }) => (
                <div>
                  <SelectedMutil<number>
                    label="Thể loại"
                    placeholder="Chọn thể loại..."
                    options={genreOptions}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    required
                  />
                  {fieldState.error && (
                    <p className="text-red-600 text-xs mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="authorIds"
              control={control}
              rules={{ required: "Vui lòng chọn tác giả" }}
              render={({ field, fieldState }) => (
                <div>
                  <SelectedMutil<number>
                    label="Tác giả"
                    placeholder="Chọn tác giả..."
                    options={authorOptions}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    required
                  />
                  {fieldState.error && (
                    <p className="text-red-600 text-xs mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="publisherId"
              control={control}
              rules={{ required: "Vui lòng chọn nhà xuất bản" }}
              render={({ field, fieldState }) => (
                <div>
                  <SelectBox<number>
                    label="Nhà xuất bản"
                    options={publisherOptions}
                    placeholder="Chọn nhà xuất bản..."
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    required
                  />
                  {fieldState.error && (
                    <p className="text-red-600 text-xs mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="seriesId"
              control={control}
              render={({ field }) => (
                <SelectBox<number>
                  searchable
                  label="Series"
                  options={seriesOptions}
                  value={field.value}
                  placeholder="Chọn series..."
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* IMAGE UPLOAD SECTION */}
      <div className="col-span-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <ImageIcon size={18} className="text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Ảnh sản phẩm</h2>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setImageUploadMode("file")}
            className={`flex-1 py-2 rounded-md text-sm transition ${imageUploadMode === "file" ? "bg-white shadow text-indigo-600 font-semibold" : "text-slate-500"}`}
          >
            Tải tệp ảnh
          </button>
          <button
            type="button"
            onClick={() => setImageUploadMode("url")}
            className={`flex-1 py-2 rounded-md text-sm transition ${imageUploadMode === "url" ? "bg-white shadow text-indigo-600 font-semibold" : "text-slate-500"}`}
          >
            Nhập URL
          </button>
        </div>

        {imageUploadMode === "file" && (
          <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 transition">
            <Upload size={28} className="text-slate-400 mb-2" />
            <span className="text-sm text-slate-600">Chọn ảnh từ máy tính</span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        )}

        {imageUploadMode === "url" && (
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Thêm
            </button>
          </div>
        )}

        {coverImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {coverImages.map((image, index) => (
              <div
                key={index}
                className={`group relative aspect-square rounded-xl overflow-hidden border-2 bg-slate-50 ${image.isThumbnail ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200"}`}
              >
                <img src={image.url} alt={`Ảnh ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                <button
                  type="button"
                  onClick={() => handleSetThumbnail(index)}
                  className={`absolute top-2 left-2 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm transition ${image.isThumbnail ? "bg-indigo-600 text-white" : "bg-white text-slate-700 hover:bg-indigo-50"}`}
                >
                  {image.isThumbnail ? "Đại diện" : "Chọn"}
                </button>

                {!image.isThumbnail && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white opacity-100 sm:opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}/{MAX_IMAGES}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-red-500 py-6 font-medium">
            Chưa có ảnh nào được chọn làm ảnh bìa.
          </div>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className="col-span-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <FileText size={18} className="text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Mô tả chi tiết</h2>
        </div>
        <ProductDescriptionEditor value={description} onChange={(value) => setValue("description", value)} />
      </div>
    </form>
  );
}