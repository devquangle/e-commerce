import { useState, useMemo } from "react";
import ProductDescriptionEditor from "../../components/admin/ProductDescriptionEditor";
import SelectedMutil from "@/components/common/SelectedMutil";
import {
  BookOpen,
  Save,
  Plus,
  Trash2,
  DollarSign,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Loader2,
  Upload,
  Edit,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useListGenre } from "@/hooks/useGenre";

import type { AuthorResponse } from "@/types/author";
import type { GenreResponse } from "@/types/genre";
import { useAuthor } from "@/hooks/useAuthor";
import { usePublisher } from "@/hooks/usePublisher";
import SelectBox from "@/components/common/SelectedBox";
import { Controller, useForm } from "react-hook-form";
import InputField from "@/components/common/InputField";
import { showWarningToast } from "@/utils/toastUtil";
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
  description: string;
  coverImages: CoverImage[];
};

const initialForm: CreateBookForm = {
  name: "",
  authorIds: [],
  publisherId: undefined,
  genreIds: [],
  weight: 500,
  publishYear: "01-01-2020",
  pages: 200,
  originalPrice: 200000,
  price: 190000,

  quantity: 10,
  status: "ACTIVE",
  description: "",
  coverImages: [] as CoverImage[],
};

export default function CreateProduct() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    watch,
    setError,
    formState: { errors ,isSubmitted},
  } = useForm<CreateBookForm>({
    defaultValues: initialForm,
  });

  const { data: genresData = [] } = useListGenre();

  const { data: authorsData = [] } = useAuthor();
  const { data: publishersData = [] } = usePublisher();

  const MAX_IMAGES = 6;
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">(
    "file",
  );

  const [imageUrl, setImageUrl] = useState("");

  const coverImages = watch("coverImages");

  // Map genres to Options for SelectedMutil
  const genreOptions = useMemo(() => {
    return genresData.map((g: GenreResponse) => ({
      label: g.name,
      value: g.id,
    }));
  }, [genresData]);

  // Map authors to Options for SelectedMutil
  const authorOptions = useMemo(() => {
    return authorsData.map((author: AuthorResponse) => ({
      label: author.displayName,
      value: author.id,
    }));
  }, [authorsData]);
  // Map publishers to Options for SelectBox
  const publisherOptions = useMemo(() => {
    return publishersData.map((publisher) => ({
      label: publisher.displayName,
      value: publisher.id,
    }));
  }, [publishersData]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const currentImages = getValues("coverImages") || [];

    if (currentImages.length >= MAX_IMAGES) {
      showWarningToast(
        `Bạn chỉ được phép tải lên tối đa ${MAX_IMAGES} hình ảnh.`,
      );
      e.target.value = "";
      return;
    }


    const availableSlots = MAX_IMAGES - currentImages.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);


    if (files.length > availableSlots) {
      showWarningToast(
        `Chỉ có thể thêm ${availableSlots} ảnh. Các ảnh dư thừa đã bị loại bỏ.`,
      );
    }


    const newImages: CoverImage[] = filesToUpload.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isThumbnail: false,
    }));

   
    const hasThumbnail = currentImages.some((img) => img.isThumbnail);
    if (!hasThumbnail && newImages.length > 0) {
      newImages[0].isThumbnail = true;
    }


    setValue("coverImages", [...currentImages, ...newImages], {
      shouldDirty: true,
      shouldValidate: true,
    });

 
    e.target.value = "";
  }; 

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;

    const currentImages = getValues("coverImages") || [];

    if (currentImages.length >= MAX_IMAGES) {
      showWarningToast(
        `Danh sách đã đạt tối đa ${MAX_IMAGES} hình ảnh. Không thể thêm từ URL.`,
      );
      return;
    }

    const newImage: CoverImage = {
      url: imageUrl.trim(),
      // Nếu mảng đang trống HOẶC hiện tại không có ảnh nào làm thumbnail thì cái này làm thumbnail
      isThumbnail:
        currentImages.length === 0 ||
        !currentImages.some((img) => img.isThumbnail),
    };

    setValue("coverImages", [...currentImages, newImage], {
      shouldDirty: true,
      shouldValidate: true,
    });

    setImageUrl("");
  };

  const handleSetThumbnail = (index: number) => {
    const images = getValues("coverImages") || [];
    if (index < 0 || index >= images.length) return;

    setValue(
      "coverImages",
      images.map((img, i) => ({
        ...img,
        isThumbnail: i === index, 
      })),
      {
        shouldDirty: true,
      },
    );
  };

  const handleRemoveImage = (index: number) => {
    const images = getValues("coverImages") || [];
    if (index < 0 || index >= images.length) return;

    const imageToRemove = images[index];

    if (imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    const updatedImages = images.filter((_, i) => i !== index);

    if (imageToRemove.isThumbnail && updatedImages.length > 0) {
      updatedImages[0].isThumbnail = true;
    }

    setValue("coverImages", updatedImages, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  return (
    <section className="max-w-7xl mx-auto w-full">
      {/* HEADER - STATIC & SIMPLIFIED */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <Link
              to="/admin/products"
              className="hover:text-indigo-600 transition-colors"
            >
              Sách
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-semibold">Thêm mới</span>
          </div>
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
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Eye size={15} />
            Xem nháp
          </button>
          <button
            type="button"
            onClick={() => handleSubmit((data) => console.log(data))()}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            Lưu
          </button>
        </div>
      </div>

      {/* FORM BODY */}
      <form
        id="create-product-form"
        className="grid gap-6 lg:grid-cols-3 items-start"
      >
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* BASIC INFORMATION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <BookOpen size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Thông tin sách cơ bản
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Tên sách */}
              <div className="md:col-span-2 space-y-1.5">
                <InputField
                  label="Tên sách"
                  name="name"
                  type="text"
                  placeholder="Nhập tên sách.."
                  register={register}
                  rules={{
                    required: "Tên sách là bắt buộc",
                  }}
                  error={errors?.name}
                />
              </div>

              {/* Tác giả, thể loại, nhà xuất bản — 1 cột */}
              <div className="md:col-span-2 space-y-4">
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
                        required={true}
                      />  
                      
                      <p className="text-red-600 text-sm mt-1">
                        {fieldState.error?.message}
                      </p>
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
                        required={true}
                      />
                      <p className="text-red-600 text-sm mt-1">
                        {fieldState.error?.message}
                      </p>
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
                        required={true}
                      />
                      <p className="text-red-600 text-sm mt-1">
                        {fieldState.error?.message}
                      </p>
                    </div>
                  )}
                />
              </div>
              {/* Năm xuất bản, số trang, trọng lượng — 1 cột */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Ngày xuất bản"
                  name="publishYear"
                  type="date"
                  placeholder="Chọn ngày xuất bản.."
                  register={register}
                  error={errors?.publishYear}
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
              </div>
            </div>
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <FileText size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Mô tả chi tiết
              </h2>
            </div>
            <div className="space-y-1.5">
              <ProductDescriptionEditor
                value={getValues("description")}
                onChange={(value) => setValue("description", value)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* PRICE AND quantity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <DollarSign size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Giá bán & Số lượng
              </h2>
            </div>

            <div className="space-y-4">
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
                  min: {
                    value: 0,
                    message: "Giá nhập phải lớn hơn hoặc bằng 0",
                  },
                  validate: (value) => {
                    const price = getValues("price");

                    // Chưa nhập giá bán thì bỏ qua
                    if (
                      price === undefined ||
                      price === null ||
                      Number.isNaN(price)
                    ) {
                      return true;
                    }

                    return (
                      Number(value) <= Number(price) ||
                      "Giá nhập không được lớn hơn giá bán"
                    );
                  },
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
                  min: {
                    value: 0,
                    message: "Giá bán phải lớn hơn hoặc bằng 0",
                  },
                  validate: (value) => {
                    const originalPrice = getValues("originalPrice");

                    // Chưa nhập giá nhập thì bỏ qua
                    if (
                      originalPrice === undefined ||
                      originalPrice === null ||
                      Number.isNaN(originalPrice)
                    ) {
                      return true;
                    }

                    return (
                      Number(value) >= Number(originalPrice) ||
                      "Giá bán không được nhỏ hơn giá nhập"
                    );
                  },
                }}
                error={errors.price}
              />

              {/* Số lượng  */}
              <InputField
                label="Số lượng "
                name="quantity"
                type="number"
                placeholder="Nhập số lượng.."
                register={register}
                rules={{
                  required: "Số lượng là bắt buộc",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Số lượng phải lớn hơn hoặc bằng 0",
                  },
                }}
                error={errors?.quantity}
              />

              {/* Trạng thái */}
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

          {/* PRODUCT IMAGES */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <ImageIcon size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Ảnh sản phẩm
              </h2>
            </div>

            {/* Switch */}
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setImageUploadMode("file")}
                className={`flex-1 py-2 rounded-md text-sm transition ${
                  imageUploadMode === "file"
                    ? "bg-white shadow text-indigo-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                Tải tệp ảnh
              </button>

              <button
                type="button"
                onClick={() => setImageUploadMode("url")}
                className={`flex-1 py-2 rounded-md text-sm transition ${
                  imageUploadMode === "url"
                    ? "bg-white shadow text-indigo-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                Nhập URL
              </button>
            </div>

            {/* Upload file */}
            {imageUploadMode === "file" && (
              <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                <Upload size={28} className="text-slate-400 mb-2" />

                <span className="text-sm text-slate-600">
                  Chọn ảnh từ máy tính
                </span>

                <span className="text-xs text-slate-400 mt-1">
                  PNG, JPG, WEBP
                </span>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}

            {/* Upload URL */}
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

            {/* Preview */}
            {coverImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {coverImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden border-2 ${
                      image.isThumbnail
                        ? "border-indigo-500"
                        : "border-slate-200"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />

                    {/* Thumbnail */}
                    <button
                      type="button"
                      onClick={() => handleSetThumbnail(index)}
                      className={`absolute top-2 left-2 text-[10px] px-2 py-1 rounded-md ${
                        image.isThumbnail
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-slate-700"
                      }`}
                    >
                      {image.isThumbnail ? "Ảnh đại diện" : "Đặt đại diện"}
                    </button>

                    {/* Delete */}
                    {!image.isThumbnail && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {coverImages.length === 0 && isSubmitted  &&(
              <div className="text-center text-sm text-red-600 py-6">
                Chưa có ảnh nào được thêm
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
