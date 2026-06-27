import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
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
  Pencil,
} from "lucide-react";

import ProductDescriptionEditor from "@/modules/admin/product/components/ProductDescriptionEditor";
import SelectedMutil from "@/components/common/SelectedMutil";
import SelectBox from "@/components/common/SelectedBox";
import InputField from "@/components/common/InputField";
import SearchInput from "@/components/common/SearchInput";
import Button from "@/components/common/Button";
import Loading from "@/components/common/Loading";

import { registerLocale, getNames } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";

import { useBookFormData } from "@/hooks/useBookFormData";
import { useFilterGoogleBook } from "@/hooks/useGoogleBook";

import useDebounce from "@/hooks/useDebounce";

import imageService from "@/services/imageService";
import { useProductSearchApi } from "@/modules/admin/product/hooks/useProductSearchApi";
import { useGemini } from "@/modules/admin/product/hooks/useGemini";

import { showSuccessToast, showWarningToast } from "@/utils/toastUtil";

import type { ImageProductRequest } from "@/types/image";

import type { GoogleBookResponse } from "@/types/googlebook";
import { useCreateProduct } from "@/modules/admin/product/hooks/useProduct";
import type { ProductRequest } from "@/modules/admin/product/types/product.type";

const MAX_IMAGES = 6;

const INITIAL_FORM: ProductRequest = {
  name: "",
  originalPrice: 200000,
  price: 190000,
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
    <p><strong>Tác giả:</strong> Chuyên gia uy tín với nhiều năm kinh nghiệm thực chiến trong ngành. Các tác phẩm xuất bản luôn đón nhận sự hưởng ứng mạnh mẽ của đông đảo độc giả.</p>
  `,
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();
  const { mutateAsync: fetchSearchApiImages } = useProductSearchApi();
  const { mutateAsync: fetchGeminiBookMeta } = useGemini();

  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">(
    "file",
  );
  const [imageUrl, setImageUrl] = useState("");
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const languageOptions = useMemo(() => {
    registerLocale(viLocale);
    const names = getNames("vi");
    return Object.entries(names)
      .map(([code, name]) => ({
        label: name.charAt(0).toUpperCase() + name.slice(1),
        value: code,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "vi"));
  }, []);

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
  const debouncedName = useDebounce(inputName, 1000);
  const watchedPrice = useWatch({ control, name: "price" });
  const watchedOriginalPrice = useWatch({ control, name: "originalPrice" });

  // Watch riêng biệt nhóm dữ liệu đồng bộ Table để tối ưu re-render qua debounce
  const taxonomyWatch = useWatch({
    control,
    name: [
      "authorIds",
      "genreIds",
      "publisherId",
      "publishYear",
      "pages",
      "seriesId",
    ],
  });

  const { data: googleBooks = [], isFetching: isLoadingGoogleBooks } =
    useFilterGoogleBook(debouncedName);

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

  const watchedAuthorIds = taxonomyWatch?.[0] as number[] | undefined;

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

  // Highlight văn bản tìm kiếm trùng khớp ngắn gọn
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(
      new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
    );
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-transparent font-bold text-indigo-700">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </>
    );
  };

  if (isLoading) return <Loading message="Đang tải dữ liệu form..." />;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu.
      </div>
    );

  return (
    <form
      id="create-product-form"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch"
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
            <Button
              type="button"
              color="secondary"
              className="w-full sm:w-auto"
            >
              <Eye size={15} /> Xem nháp
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              color="warning"
              className="w-full sm:w-auto"
            >
              <RotateCcw size={15} /> Đặt lại
            </Button>
            <Button
              type="submit"
              color="primary"
              className="w-full sm:w-auto"
              disabled={isCreating || isSaving}
            >
              <Save size={15} />{" "}
              {isCreating || isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. LEFT COLUMN: BASIC INFO */}
      <div className="col-span-12 xl:col-span-7 space-y-6 xl:h-full">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5 xl:h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <BookOpen size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Thông tin sách cơ bản
              </h2>
            </div>

            <div className="grid gap-4 mt-4">
              <SearchInput<ProductRequest, GoogleBookResponse>
                label="Tên sách"
                name="name"
                value={inputName}
                inputType="text"
                placeholder="Nhập tên sách.."
                register={register}
                rules={{ required: "Tên sách là bắt buộc" }}
                error={errors?.name}
                dataOptions={googleBooks ?? []}
                displayKey="name"
                valueKey="volumeId"
                disableLocalFilter
                isLoading={isLoadingGoogleBooks}
                loadingMessage="Đang tìm kiếm trên Google Books..."
                defaultMessage="Nhập tên sách để tìm trên Google Books..."
                emptyMessage={
                  inputName !== debouncedName
                    ? "Đang chờ tìm kiếm..."
                    : `Không tìm thấy sách nào cho "${inputName}"`
                }
                renderItem={(item) => {
                  const hasAllData =
                    !!item.name &&
                    item.authors?.length > 0 &&
                    !!item.thumbnail &&
                    !!item.description &&
                    !!item.isbn &&
                    !!item.description &&
                    !!item.isbn &&
                    item.pageCount !== null;
                  return (
                    <div className="flex items-center gap-3 w-full">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="h-10 w-7 shrink-0 rounded object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-10 w-7 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-400">
                          <BookOpen size={14} />
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span
                          className={
                            hasAllData
                              ? "font-bold text-slate-900"
                              : "font-medium text-slate-700"
                          }
                        >
                          {renderHighlightedText(item.name, debouncedName)}
                        </span>
                        <span className="truncate text-xs text-slate-500">
                          {item.authors?.length > 0
                            ? item.authors.join(", ")
                            : "Không rõ tác giả"}
                        </span>
                      </div>
                      {hasAllData && (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Đầy đủ
                        </span>
                      )}
                    </div>
                  );
                }}
                onSelect={async (selectedItem) => {
                  // 1. Set các giá trị form đồng bộ
                  setValue("name", selectedItem.name, { shouldDirty: true });

                  setValue(
                    "pages",
                    selectedItem.pageCount || INITIAL_FORM.pages,
                    {
                      shouldDirty: true,
                    },
                  );

                  let dateValue = INITIAL_FORM.publishYear;
                  if (selectedItem.publishedDate) {
                    dateValue = selectedItem.publishedDate;
                    if (/^\d{4}$/.test(dateValue))
                      dateValue = `${dateValue}-01-01`;
                    else if (/^\d{4}-\d{2}$/.test(dateValue))
                      dateValue = `${dateValue}-01`;
                  }
                  setValue("publishYear", dateValue, { shouldDirty: true });

                  setValue("isbn", selectedItem.isbn || INITIAL_FORM.isbn, {
                    shouldDirty: true,
                  });
                  setValue(
                    "language",
                    selectedItem.language || INITIAL_FORM.language,
                    {
                      shouldDirty: true,
                    },
                  );

                  setValue(
                    "price",
                    selectedItem.listPrice || INITIAL_FORM.price,
                    {
                      shouldDirty: true,
                    },
                  );
                  setValue(
                    "originalPrice",
                    selectedItem.retailPrice || INITIAL_FORM.originalPrice,
                    {
                      shouldDirty: true,
                    },
                  );

                  // 2. Set description với dữ liệu Google Books
                  let updatedDesc = INITIAL_FORM.description;
                  // Thay phần "Nội dung chính" bằng description từ Google Books
                  const bookDescription =
                    selectedItem.description ||
                    `Cuốn sách "${selectedItem.name}" của ${selectedItem.authors?.join(", ") || "tác giả"}.`;
                  updatedDesc = updatedDesc.replace(
                    /<p>\s*Tóm tắt cốt truyện hoặc chủ đề cuốn sách[\s\S]*?<\/p>/,
                    `<p>${bookDescription}</p>`,
                  );

                  // Tìm kiếm tác giả khớp với Google Books để tự động điền vào form và lấy tiểu sử
                  const matchedAuthors = (selectedItem.authors || [])
                    .map((authorName) =>
                      authorsData.find(
                        (a) =>
                          a.name?.toLowerCase().trim() ===
                          authorName.toLowerCase().trim(),
                      ),
                    )
                    .filter(
                      (author): author is NonNullable<typeof author> =>
                        !!author,
                    );

                  if (matchedAuthors.length > 0) {
                    setValue(
                      "authorIds",
                      matchedAuthors.map((a) => a.id),
                      { shouldDirty: true, shouldValidate: true },
                    );

                    const authorDescriptions = matchedAuthors
                      .map(
                        (a) =>
                          `<strong>${a.name || "Chưa rõ"}:</strong> ${a.description || "Chưa có mô tả."}`,
                      )
                      .join("<br/>\n");

                    const authorRegex =
                      /(<h2[^>]*>\s*Về tác giả\s*<\/h2>\s*)<p>[\s\S]*?<\/p>/i;
                    if (authorRegex.test(updatedDesc)) {
                      updatedDesc = updatedDesc.replace(
                        authorRegex,
                        `$1<p>\n${authorDescriptions}\n</p>`,
                      );
                    }
                  }

                  setValue("description", updatedDesc, { shouldDirty: true });

                  // 3. Set ảnh thumbnail từ Google Books trước
                  const thumbnailImage: ImageProductRequest =
                    selectedItem.thumbnail
                      ? { url: selectedItem.thumbnail, isThumbnail: true }
                      : { url: "", isThumbnail: true };

                  setValue("coverImages", [thumbnailImage], {
                    shouldDirty: true,
                    shouldValidate: true,
                  });

                  trigger(["price", "originalPrice"]);

                  // 4. Gọi Gemini AI + SearchAPI ĐỒNG THỜI, chờ cả 2 xong rồi cập nhật
                  setIsFetchingAI(true);
                  try {
                    const [geminiResult, searchResult] =
                      await Promise.allSettled([
                        fetchGeminiBookMeta({
                          name: selectedItem.name,
                          authors: selectedItem.authors || [],
                        }),
                        fetchSearchApiImages(selectedItem.name),
                      ]);

                    // Xử lý kết quả Gemini AI — cập nhật mô tả
                    if (geminiResult.status === "fulfilled") {
                      const metadata = geminiResult.value;
                      let newDesc = getValues("description") || "";

                      if (metadata.mainSummary) {
                        newDesc = newDesc.replace(
                          /(<h2[^>]*>\s*Nội dung chính\s*<\/h2>\s*)<p>[\s\S]*?<\/p>/,
                          `$1<p>${metadata.mainSummary}</p>`,
                        );
                      }
                      if (metadata.highlights?.length) {
                        const highlightsHtml = `<ul>\n${metadata.highlights.map((h) => `      <li>${h}</li>`).join("\n")}\n    </ul>`;
                        newDesc = newDesc.replace(
                          /<ul>\s*<li>Nội dung sách hấp dẫn[\s\S]*?<\/ul>/,
                          highlightsHtml,
                        );
                      }
                      if (metadata.artisticValue?.length) {
                        const artisticHtml = `<ul>\n${metadata.artisticValue.map((v) => `      <li>${v}</li>`).join("\n")}\n    </ul>`;
                        newDesc = newDesc.replace(
                          /<ul>\s*<li>Phong cách viết độc đáo[\s\S]*?<\/ul>/,
                          artisticHtml,
                        );
                      }
                      if (metadata.targetAudience?.length) {
                        const audienceHtml = `<ul>\n${metadata.targetAudience.map((a) => `      <li>${a}</li>`).join("\n")}\n    </ul>`;
                        newDesc = newDesc.replace(
                          /<ul>\s*<li>Các bạn học sinh, sinh viên[\s\S]*?<\/ul>/,
                          audienceHtml,
                        );
                      }
                      if (metadata.authorsBookMetas?.length) {
                        const authorDescriptions = metadata.authorsBookMetas
                          .map((a) => `<strong>${a.name}:</strong> ${a.bio}`)
                          .join("<br/>\n");
                        const authorRegex =
                          /(<h2[^>]*>\s*Về tác giả\s*<\/h2>\s*)<p>[\s\S]*?<\/p>/i;
                        if (authorRegex.test(newDesc)) {
                          newDesc = newDesc.replace(
                            authorRegex,
                            `$1<p>\n${authorDescriptions}\n</p>`,
                          );
                        }
                      }

                      setValue("description", newDesc, { shouldDirty: true });
                      showSuccessToast(
                        "Đã tự động tạo mô tả bằng AI thành công!",
                      );
                    } else {
                      console.error("Gemini error:", geminiResult.reason);
                      showWarningToast(
                        "Không thể tạo mô tả bằng AI. Đang dùng mô tả gốc.",
                      );
                    }

                    // Xử lý kết quả SearchAPI — cập nhật ảnh bổ sung
                    if (searchResult.status === "fulfilled") {
                      const allSearchUrls = searchResult.value.urlImage || [];
                      const searchImages: ImageProductRequest[] = allSearchUrls
                        .slice(0, 5)
                        .map((imgUrl) => ({
                          url: imgUrl,
                          isThumbnail: false,
                        }));

                      const currentImages = getValues("coverImages") || [];
                      const combined = [
                        ...currentImages,
                        ...searchImages,
                      ].slice(0, MAX_IMAGES);
                      setValue("coverImages", combined, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });

                      showSuccessToast(
                        `Đã tải ${searchImages.length} ảnh bổ sung từ SearchAPI!`,
                      );
                    } else {
                      console.error("SearchAPI error:", searchResult.reason);
                      showWarningToast(
                        "Không thể tải ảnh bổ sung từ SearchAPI.",
                      );
                    }
                  } finally {
                    setIsFetchingAI(false);
                  }
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  }}
                  error={errors.originalPrice}
                />

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
                    min: {
                      value: 0,
                      message: "Số lượng phải lớn hơn hoặc bằng 0",
                    },
                  }}
                  error={errors?.quantity}
                />

                {typeof watchedPrice === "number" &&
                typeof watchedOriginalPrice === "number" &&
                watchedPrice < watchedOriginalPrice ? (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-medium">
                    <svg
                      className="w-4 h-4 text-amber-500 shrink-0 animate-bounce"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>
                      Giá bán đang thấp hơn giá nhập, bạn có chắc chắn muốn tiếp
                      tục?
                    </span>
                  </div>
                ) : null}

                <InputField
                  label="Số trang"
                  name="pages"
                  type="number"
                  placeholder="Nhập số trang.."
                  register={register}
                  rules={{
                    required: "Số trang là bắt buộc",
                  }}
                  error={errors?.pages}
                />
                <InputField
                  label="Trọng lượng (g)"
                  name="weight"
                  type="number"
                  placeholder="Nhập trọng lượng.."
                  rules={{
                    required: "Trọng lượng là bắt buộc",
                  }}
                  register={register}
                  error={errors?.weight}
                />
                <InputField
                  label="Ngày xuất bản"
                  name="publishYear"
                  type="date"
                  rules={{
                    required: "Ngày xuất bản là bắt buộc",
                  }}
                  register={register}
                  error={errors?.publishYear}
                />
                <InputField
                  label="Isbn"
                  name="isbn"
                  type="text"
                  register={register}
                  error={errors?.isbn}
                />

                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <SelectBox<string>
                      searchable={true}
                      label="Ngôn ngữ"
                      options={languageOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
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
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RIGHT COLUMN: TAXONOMY */}
      <div className="col-span-12 xl:col-span-5 space-y-6 xl:h-full">
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
                    onChange={field.onChange}
                    required
                  />
                  {fieldState.error && (
                    <p className="text-red-600 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
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
                    onChange={field.onChange}
                    required
                  />
                  {fieldState.error && (
                    <p className="text-red-600 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
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
                    onChange={field.onChange}
                    required
                    isClearable
                  />
                  {fieldState.error && (
                    <p className="text-red-600 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
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
                  onChange={field.onChange}
                  isClearable
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* 4. IMAGE UPLOAD SECTION */}
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
      <div className="col-span-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
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
    </form>
  );
}
