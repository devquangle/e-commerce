import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Trash2,
  FileText,
  Image as ImageIcon,
  Upload,
  Eye,
  Pencil,
} from "lucide-react";

import ProductHeaderAdd from "@/modules/admin/product/components/ProductHeaderAdd";
import ProductBasicInfo from "@/modules/admin/product/components/ProductBasicInfo";
import ProductAttribute from "@/modules/admin/product/components/ProductAttribute";
import ProductDescriptionEditor from "@/modules/admin/product/components/ProductDescriptionEditor";
import Loading from "@/components/common/Loading";

import { useBookFormData } from "@/hooks/useBookFormData";
import imageService from "@/services/imageService";
import { showWarningToast } from "@/utils/toastUtil";

import type { ImageProductRequest } from "@/types/image";
import { useCreateProduct } from "@/modules/admin/product/hooks/useProduct";
import type { ProductRequest } from "@/modules/admin/product/types/product.type";

const MAX_IMAGES = 6;

const INITIAL_FORM: ProductRequest = {
  name: "",
  originalPrice: 200000,
  price: 300000,
  quantity: 10,
  weight: 500,
  publishYear: "2020-01-01",
  pages: 200,
  language: "vi",
  authorIds: [],
  genreIds: [],
  publisherId: undefined,
  seriesId: undefined,
  isbn: "",
  status: "ACTIVE",
  coverImages: [],
  description: `
    <h2 style="margin-top: 24px; margin-bottom: 12px;">Nội dung chính</h2>
    <p>Tóm tắt cốt truyện hoặc chủ đề cuốn sách ngắn gọn, hấp dẫn tại đây. Mỗi đoạn văn nên có độ dài từ 3-5 câu để độc giả có thể dễ dàng nắm bắt thông tin và mạch truyện.</p>
    
    <h2 style="margin-top: 24px; margin-bottom: 12px;">Điểm nổi bật</h2>
    <ul>
      <li>Nội dung sách hấp dẫn, dễ tiếp cận và được trình bày một cách khoa học.</li>
      <li>Cung cấp nhiều bài học và ví dụ thực tiễn sâu sắc cho độc giả.</li>
      <li>Ngôn từ lôi cuốn, văn phong mạch lạc và lối kể chuyện tự nhiên.</li>
    </ul>
    
    <h2 style="margin-top: 24px; margin-bottom: 12px;">Giá trị nghệ thuật</h2>
    <ul>
      <li>Phong cách viết độc đáo, sáng tạo và mang đậm dấu ấn cá nhân của tác giả.</li>
      <li>Kết cấu tác phẩm chặt chẽ, logic và giàu tính thẩm mỹ.</li>
      <li>Ngôn ngữ giàu hình ảnh, gợi cảm xúc và có chiều sâu văn học.</li>
    </ul>
    
    <h2 style="margin-top: 24px; margin-bottom: 12px;">Đối tượng độc giả</h2>
    <ul>
      <li>Các bạn học sinh, sinh viên muốn nâng cao hiểu biết về lĩnh vực này.</li>
      <li>Người đi làm muốn tìm kiếm những giải pháp ứng dụng thực tế.</li>
    </ul>
    
    <h2 style="margin-top: 24px; margin-bottom: 12px;">Về tác giả</h2>
    <p><strong>Tác giả:</strong> Chuyên gia uy tín với nhiều năm kinh nghiệm thực chiến trong ngành. Các tác phẩm xuất bản luôn đón nhận sự hưởng ứng mạnh mẽ của độc giả.</p>
  `,
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();

  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">(
    "file",
  );
  const [imageUrl, setImageUrl] = useState("");
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<ProductRequest>({
    defaultValues: INITIAL_FORM,
    mode: "onChange",
  });

  const {
    genresData = [],
    authorsData = [],
    publishersData = [],
    seriesData = [],
    isLoading,
    isError,
  } = useBookFormData();

  // Watch các trường dữ liệu
  const coverImagesRaw = useWatch({ name: "coverImages", control });
  const coverImages = useMemo(() => coverImagesRaw || [], [coverImagesRaw]);
  const inputName = useWatch({ control, name: "name" }) || "";

  // Khởi tạo Options sử dụng useMemo ổn định
  const genreOptions = useMemo(
    () => genresData.map((g) => ({ label: g.name, value: g.id })),
    [genresData],
  );
  const authorOptions = useMemo(
    () => authorsData.map((a) => ({ label: a.name, value: a.id })),
    [authorsData],
  );
  const publisherOptions = useMemo(
    () => publishersData.map((p) => ({ label: p.name, value: p.id })),
    [publishersData],
  );
  const seriesOptions = useMemo(
    () => seriesData.map((s) => ({ label: s.name, value: s.id })),
    [seriesData],
  );

  const watchedAuthorIds = useWatch({ control, name: "authorIds" });

  const watchedAuthorNames = useMemo(() => {
    return (watchedAuthorIds || [])
      .map((id) => authorOptions.find((a) => a.value === id)?.label)
      .filter(Boolean)
      .join(", ");
  }, [watchedAuthorIds, authorOptions]);

  // Clean up Object URL tránh tràn bộ nhớ (Memory Leak)
  useEffect(() => {
    return () => {
      coverImages.forEach((img) => {
        if (img.url?.startsWith("blob:")) URL.revokeObjectURL(img.url);
      });
    };
  }, [coverImages]);

  // Xử lý Submit Form chính
  const onSubmit = async (data: ProductRequest) => {
    try {
      if (!coverImages.length) {
        showWarningToast("Vui lòng thêm ít nhất một ảnh sản phẩm!");
        return;
      }

      setIsSaving(true);

      const uploadedImages: ImageProductRequest[] =
        coverImages.length > 0
          ? await imageService.uploadImage(coverImages)
          : [];

      await createProduct({
        ...data,
        coverImages: uploadedImages,
      });

      handleReset();
      navigate("/admin/products");
    } catch {
      // Toast lỗi đã được xử lý bởi onError trong hook useCreateProduct
    } finally {
      setIsSaving(false);
    }
  };

  // Các hàm quản lý File Hình Ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (coverImages.length >= MAX_IMAGES) {
      showWarningToast(
        `Bạn chỉ được phép tải lên tối đa ${MAX_IMAGES} hình ảnh.`,
      );
      return;
    }

    const availableSlots = MAX_IMAGES - coverImages.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);

    const validFiles: File[] = [];
    for (const file of filesToUpload) {
      if (file.size > 1048576) {
        showWarningToast(`Ảnh "${file.name}" vượt quá 1MB và đã bị bỏ qua.`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) return;

    const newImages: ImageProductRequest[] = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isThumbnail: false,
    }));

    if (!coverImages.some((img) => img.isThumbnail) && newImages.length > 0) {
      newImages[0].isThumbnail = true;
    }

    setValue("coverImages", [...coverImages, ...newImages], {
      shouldDirty: true,
      shouldValidate: true,
    });
    e.target.value = "";
  };

  const handleAddImageUrl = () => {
    const trimmedUrl = imageUrl.trim();
    if (!trimmedUrl) return;

    try {
      const url = new URL(trimmedUrl);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      showWarningToast("URL ảnh không hợp lệ.");
      return;
    }

    if (coverImages.length >= MAX_IMAGES) {
      showWarningToast(`Danh sách đã đạt tối đa ${MAX_IMAGES} hình ảnh.`);
      return;
    }

    const newImage: ImageProductRequest = {
      url: trimmedUrl,
      isThumbnail:
        coverImages.length === 0 || !coverImages.some((img) => img.isThumbnail),
    };

    setValue("coverImages", [...coverImages, newImage], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = coverImages[index];
    if (imageToRemove.url?.startsWith("blob:")) {
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

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceIndex === null) return;

    if (file.size > 1048576) {
      showWarningToast("Hình ảnh thay thế phải có kích thước dưới 1MB!");
      e.target.value = "";
      return;
    }

    const oldImage = coverImages[replaceIndex];
    if (oldImage.url?.startsWith("blob:")) {
      URL.revokeObjectURL(oldImage.url);
    }

    const newImage: ImageProductRequest = {
      file,
      url: URL.createObjectURL(file),
      isThumbnail: oldImage.isThumbnail,
    };

    const updatedImages = [...coverImages];
    updatedImages[replaceIndex] = newImage;

    setValue("coverImages", updatedImages, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setReplaceIndex(null);
    e.target.value = "";
  };

  const handleReset = () => {
    coverImages.forEach((img) => {
      if (img.url?.startsWith("blob:")) URL.revokeObjectURL(img.url);
    });
    reset(INITIAL_FORM);
  };

  if (isLoading) return <Loading message="Đang tải dữ liệu form..." />;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu.
      </div>
    );

  return (
    <div
      id="create-product-form"
      className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch"
    >
      {/* Loading overlay khi đang gọi AI + SearchAPI hoặc đang lưu */}
      {(isFetchingAI || isSaving) && (
        <Loading
          message={
            isSaving ? "Đang lưu sản phẩm..." : "Đang đồng bộ dữ liệu AI..."
          }
          subMessage="Vui lòng chờ trong giây lát..."
        />
      )}

      {/* 1. HEADER ACTIONS */}
      <ProductHeaderAdd
        title="Thêm sách mới"
        subtitle="Điền đầy đủ thông tin bên dưới và tải ảnh để khởi tạo sản phẩm sách mới trong hệ thống."
        onBack={() => navigate("/admin/products")}
        onReset={handleReset}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isCreating || isSaving}
        submitButtonText="Lưu sản phẩm"
      />

      {/* 2. LEFT COLUMN: BASIC INFO */}
      <ProductBasicInfo
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
        trigger={trigger}
        setIsFetchingAI={setIsFetchingAI}
      />

      {/* 3. RIGHT COLUMN: TAXONOMY */}
      <ProductAttribute
        control={control}
        genreOptions={genreOptions}
        authorOptions={authorOptions}
        publisherOptions={publisherOptions}
        seriesOptions={seriesOptions}
      />

      {/* 4. IMAGE UPLOAD SECTION */}
      <div className="col-span-12 card-custom space-y-4">
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

        {imageUploadMode === "file" ? (
          <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-500 transition">
            <Upload size={28} className="text-slate-400 mb-2" />
            <span className="text-sm text-slate-600">Chọn ảnh từ máy tính</span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImageUrl();
                }
              }}
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

        {coverImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {coverImages.map((image, index) => (
              <div
                key={index}
                className={`group relative aspect-square rounded-xl overflow-hidden border-2 bg-slate-50 ${image.isThumbnail ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200"}`}
              >
                <img
                  src={image.url || ""}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "coverImages",
                      coverImages.map((img, i) => ({
                        ...img,
                        isThumbnail: i === index,
                      })),
                      { shouldDirty: true },
                    )
                  }
                  className={`absolute top-2 left-2 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm transition ${image.isThumbnail ? "bg-indigo-600 text-white" : "bg-white text-slate-700 hover:bg-indigo-50"}`}
                >
                  {image.isThumbnail ? "Đại diện" : "Chọn"}
                </button>
                <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    title="Xem ảnh"
                    onClick={() => setPreviewImage(image.url || "")}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-white hover:bg-slate-700 shadow-sm cursor-pointer"
                  >
                    <Eye size={12} />
                  </button>
                  <button
                    type="button"
                    title="Thay thế ảnh"
                    onClick={() => {
                      setReplaceIndex(index);
                      replaceFileInputRef.current?.click();
                    }}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                  >
                    <Pencil size={12} />
                  </button>
                  {!image.isThumbnail && (
                    <button
                      type="button"
                      title="Xóa ảnh"
                      onClick={() => handleRemoveImage(index)}
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}/{MAX_IMAGES}
                </div>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          ref={replaceFileInputRef}
          hidden
          accept="image/*"
          onChange={handleReplaceFileChange}
        />

        {isSubmitted && coverImages.length === 0 && (
          <div className="text-center text-sm py-8 border border-dashed rounded-xl border-red-500 text-red-500 bg-red-50">
            Chưa có ảnh nào được thêm
            <p className="mt-2 text-xs font-medium text-red-500">
              Vui lòng thêm ít nhất một ảnh sản phẩm!
            </p>
          </div>
        )}
      </div>

      {/* 5. DESCRIPTION */}
      <div className="col-span-12 card-custom space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <FileText size={18} className="text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">Mô tả chi tiết</h2>
        </div>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <ProductDescriptionEditor
              value={field.value}
              onChange={field.onChange}
              bookName={inputName}
              authorNames={watchedAuthorNames}
            />
          )}
        />
      </div>

      {/* Lightbox Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-slate-900/50 hover:bg-slate-900/80 p-2.5 rounded-full transition-colors cursor-pointer"
            onClick={() => setPreviewImage(null)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="max-w-[90%] max-h-[90%] flex items-center justify-center p-4">
            <img
              src={previewImage}
              alt="Xem ảnh lớn"
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl border border-slate-800"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
