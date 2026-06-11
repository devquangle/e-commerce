import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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

import ProductDescriptionEditor from "../../components/admin/product/ProductDescriptionEditor";
import SelectedMutil from "@/components/common/SelectedMutil";
import SelectBox from "@/components/common/SelectedBox";
import InputField from "@/components/common/InputField";
import SearchInput from "@/components/common/SearchInput";
import Button from "@/components/common/Button";

import { useBookFormData } from "@/hooks/useBookFormData";
import { useFilterGoogleBook } from "@/hooks/useGoogleBook";
import { useGroqBook } from "@/hooks/useGroq";
import useDebounce from "@/hooks/useDebounce";

import imageService from "@/services/imageService";
import productService from "@/services/productService";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/utils/toastUtil";

import type { AuthorResponse } from "@/types/author";
import type { GenreResponse } from "@/types/genre";
import type { ImageProductRequest } from "@/types/image";
import type { ProductRequest } from "@/types/product.type";
import type { GoogleBookResponse } from "@/types/googlebook";

const MAX_IMAGES = 6;

const INITIAL_FORM: ProductRequest = {
  name: "",
  originalPrice: 200000,
  price: 190000,
  quantity: 10,
  weight: 500,
  publishYear: "2020-01-01",
  pages: 200,
  authorIds: [],
  genreIds: [],
  publisherId: undefined,
  seriesId: undefined,
  status: "ACTIVE",
  coverImages: [],
  description: `
    <h4><strong>Giới Thiệu Sách</strong></h4>
    <p>Nhập phần giới thiệu ngắn gọn về cuốn sách tại đây. Mô tả nội dung chính, thông điệp nổi bật hoặc giá trị mà cuốn sách mang lại cho người đọc.</p>
    <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600" alt="Ảnh bìa sách" style="width: 40%; max-width: 100%; height: auto;" class="block mx-auto" />
    <p style="text-align:center; font-size: 14px; color: #666;"><em>Hình ảnh minh họa cho cuốn sách</em></p>
    <hr />
    <h5><strong>1. Nội Dung Chính</strong></h5>
    <p>Mô tả ngắn gọn cốt truyện, kiến thức hoặc chủ đề chính của cuốn sách. Có thể chia thành nhiều đoạn văn để người đọc dễ theo dõi.</p>
    <h5><strong>2. Điểm Nổi Bật</strong></h5>
    <ul>
      <li>Nội dung hấp dẫn và dễ tiếp cận.</li>
      <li>Thông tin được trình bày rõ ràng, logic.</li>
      <li>Phù hợp với nhiều nhóm độc giả.</li>
      <li>Mang lại giá trị thực tiễn cho người đọc.</li>
    </ul>
    <hr />
    <h5><strong>3. Thông Tin Sách</strong></h5>
    <table>
      <tbody>
        <tr><th>Thuộc tính</th><th>Thông tin</th></tr>
        <tr><td>Tác giả</td><td>[Tên tác giả]</td></tr>
        <tr><td>Thể loại</td><td>[Tên thể loại]</td></tr>
        <tr><td>Nhà xuất bản</td><td>[Tên nhà xuất bản]</td></tr>
        <tr><td>Ngày xuất bản</td><td>[Ngày xuất bản]</td></tr>
        <tr><td>Số trang</td><td>[Số trang]</td></tr>
      </tbody>
    </table>
    <hr />
    <h5><strong>4. Đối Tượng Độc Giả</strong></h5>
    <p>Cuốn sách phù hợp với những người quan tâm đến chủ đề này, học sinh, sinh viên hoặc người đi làm muốn mở rộng kiến thức.</p>
    <hr />
    <h5><strong>5. Về Tác Giả</strong></h5>
    <p>Giới thiệu ngắn gọn về tác giả</p>
  `,
};

// Helper cập nhật HTML table gọn gàng hơn
const updateTableHtml = (html: string, rowLabel: string, newValue: string) => {
  const regex = new RegExp(
    `(<td[^>]*>(?:<p[^>]*>)?\\s*${rowLabel}\\s*(?:<\\/p>)?<\\/td>\\s*<td[^>]*>(?:<p[^>]*>)?)([\\s\\S]*?)(<\\/p>)?(<\\/td>)`,
    "i",
  );
  return html.replace(
    regex,
    (_, p1, __, p3, p4) => `${p1}${newValue}${p3 || ""}${p4}`,
  );
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const [imageUploadMode, setImageUploadMode] = useState<"file" | "url">(
    "file",
  );
  const [imageUrl, setImageUrl] = useState("");
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

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
  const debouncedTaxonomy = useDebounce(taxonomyWatch, 800); // Tránh băm nát CPU khi user đang chọn liên tục

  const { data: googleBooks = [], isFetching: isLoadingGoogleBooks } =
    useFilterGoogleBook(debouncedName);
  const { mutateAsync: generateGroqDescription } = useGroqBook();

  // Khởi tạo Options sử dụng useMemo ổn định
  const genreOptions = useMemo(
    () =>
      genresData.map((g: GenreResponse) => ({ label: g.name, value: g.id })),
    [genresData],
  );
  const authorOptions = useMemo(
    () =>
      authorsData.map((a: AuthorResponse) => ({ label: a.name, value: a.id })),
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

  // Clean up Object URL tránh tràn bộ nhớ (Memory Leak)
  useEffect(() => {
    return () => {
      coverImages.forEach((img) => {
        if (img.url?.startsWith("blob:")) URL.revokeObjectURL(img.url);
      });
    };
  }, [coverImages]);

  // Tách hàm gọi AI tạo mô tả bằng Groq ra ngoài độc lập
  const handleAIGenerateDescription = useCallback(
    async (name: string, originalDesc: string) => {
      try {
        showSuccessToast("Đang dùng AI tạo mô tả chi tiết...");
        const metadata = await generateGroqDescription({
          name,
          description: originalDesc,
        });

        let newDesc = getValues("description") || "";

        if (metadata.summary) {
          newDesc = newDesc.replace(
            /<p>\s*Mô tả ngắn gọn cốt truyện[\s\S]*?<\/p>/,
            `<p>${metadata.summary}</p>`,
          );
        }
        if (metadata.highlights?.length) {
          newDesc = newDesc.replace(
            /<ul>\s*<li>Nội dung hấp dẫn[\s\S]*?<\/ul>/,
            `<p>\n${metadata.highlights.join(", <br/>\n")}\n</p>`,
          );
        }
        if (metadata.targetAudience?.length) {
          newDesc = newDesc.replace(
            /<p>\s*Cuốn sách phù hợp với những người quan tâm[\s\S]*?<\/p>/,
            `<p>${metadata.targetAudience.join(", <br/>\n")}</p>`,
          );
        }

        setValue("description", newDesc, { shouldDirty: true });
        showSuccessToast("Đã tự động tạo mô tả bằng AI thành công!");
      } catch {
        showErrorToast("Không thể tạo mô tả bằng AI. Đang dùng mô tả gốc.");
      }
    },
    [generateGroqDescription, getValues, setValue],
  );

  // Đồng bộ thông tin Sách vào HTML Table (Đã bọc Debounce 800ms cực mượt)
  useEffect(() => {
    const [authorIds, genreIds, publisherId, publishYear, pages, seriesId] =
      debouncedTaxonomy;
    const currentDesc = getValues("description");
    if (!currentDesc) return;

    let newDesc = currentDesc;

    // Tác giả
    const authorNames = ((authorIds as number[]) || [])
      .map((id) => authorOptions.find((a) => a.value === id)?.label)
      .filter(Boolean)
      .join(", ");
    newDesc = updateTableHtml(
      newDesc,
      "Tác giả",
      authorNames || "[Tên tác giả]",
    );

    // Thể loại
    const genreNames = ((genreIds as number[]) || [])
      .map((id) => genreOptions.find((g) => g.value === id)?.label)
      .filter(Boolean)
      .join(", ");
    newDesc = updateTableHtml(
      newDesc,
      "Thể loại",
      genreNames || "[Tên thể loại]",
    );

    // Nhà xuất bản
    const publisherName = publisherOptions.find(
      (p) => p.value === publisherId,
    )?.label;
    newDesc = updateTableHtml(
      newDesc,
      "Nhà xuất bản",
      publisherName || "[Tên nhà xuất bản]",
    );

    // Ngày xuất bản & Số trang
    newDesc = updateTableHtml(
      newDesc,
      "Ngày xuất bản",
      (publishYear as string) || "[Ngày xuất bản]",
    );
    newDesc = updateTableHtml(
      newDesc,
      "Số trang",
      pages ? String(pages) : "[Số trang]",
    );

    // Xử lý hàng Series
    const seriesRowRegex =
      /(<tr[^>]*>[\s\S]*?<td[^>]*>(?:<p[^>]*>)?\s*Series\s*(?:<\/p>)?<\/td>[\s\S]*?<\/tr>)/i;
    const hasSeriesRow = seriesRowRegex.test(newDesc);

    if (seriesId) {
      const seriesName =
        seriesOptions.find((s) => s.value === seriesId)?.label ||
        "[Tên series]";
      if (hasSeriesRow) {
        newDesc = updateTableHtml(newDesc, "Series", seriesName);
      } else {
        const pagesRowRegex =
          /(<tr[^>]*>[\s\S]*?<td[^>]*>(?:<p[^>]*>)?\s*Số trang\s*(?:<\/p>)?<\/td>[\s\S]*?<\/tr>)/i;
        newDesc = newDesc.replace(
          pagesRowRegex,
          (match) =>
            `${match}\n    <tr>\n      <td>Series</td>\n      <td>${seriesName}</td>\n    </tr>`,
        );
      }
    } else if (hasSeriesRow) {
      newDesc = newDesc.replace(seriesRowRegex, "");
    }

    // Cập nhật mô tả chi tiết Tác giả ở phần 5
    const selectedAuthors = ((authorIds as number[]) || [])
      .map((id) => authorsData.find((a) => a.id === id))
      .filter(Boolean);
    if (selectedAuthors.length > 0) {
      const authorDescriptions = selectedAuthors
        .map(
          (a) =>
            `- ${a?.name || "Chưa rõ"}: ${a?.description || "Chưa có mô tả."}`,
        )
        .join("<br/>\n");
      newDesc = newDesc.replace(
        /(<h5><strong>5\. Về Tác Giả<\/strong><\/h5>\s*)<p>[\s\S]*?<\/p>/i,
        `$1<p>\n${authorDescriptions}\n</p>`,
      );
    }

    if (newDesc !== currentDesc) {
      setValue("description", newDesc, { shouldDirty: true });
    }
  }, [
    debouncedTaxonomy,
    authorOptions,
    genreOptions,
    publisherOptions,
    seriesOptions,
    authorsData,
    setValue,
    getValues,
  ]);

  // Xử lý Submit Form chính
  const onSubmit = async (data: ProductRequest) => {
    try {
      if (!coverImages.length) {
        showWarningToast("Vui lòng thêm ít nhất một ảnh sản phẩm!");
        return;
      }

      const uploadedImages: ImageProductRequest[] =
        coverImages.length > 0
          ? await imageService.uploadImage(coverImages)
          : [];

      await productService.add({
        ...data,
        coverImages: uploadedImages,
      });

      showSuccessToast("Thêm sản phẩm thành công!");
      handleReset();
      navigate("/admin/products");
    } catch (error) {
      showErrorToast(`Thêm sản phẩm thất bại! ${error}`);
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

    const newImages: ImageProductRequest[] = filesToUpload.map((file) => ({
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

  if (isLoading)
    return <div className="p-6 text-center">Đang tải dữ liệu form...</div>;
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
            <Button type="submit" color="primary" className="w-full sm:w-auto">
              <Save size={15} /> Lưu
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
                onSelect={(selectedItem) => {
                  setValue("name", selectedItem.name, { shouldDirty: true });

                  if (selectedItem.pageCount)
                    setValue("pages", selectedItem.pageCount, {
                      shouldDirty: true,
                    });

                  if (selectedItem.publishedDate) {
                    let dateValue = selectedItem.publishedDate;
                    if (/^\d{4}$/.test(dateValue))
                      dateValue = `${dateValue}-01-01`;
                    else if (/^\d{4}-\d{2}$/.test(dateValue))
                      dateValue = `${dateValue}-01`;
                    setValue("publishYear", dateValue, { shouldDirty: true });
                  }

                  if (selectedItem.listPrice)
                    setValue("price", selectedItem.listPrice, {
                      shouldDirty: true,
                    });
                  if (selectedItem.retailPrice)
                    setValue("originalPrice", selectedItem.retailPrice, {
                      shouldDirty: true,
                    });

                  let updatedDesc = getValues("description") || "";
                  if (selectedItem.thumbnail) {
                    updatedDesc = updatedDesc.replace(
                      /src="https:\/\/images\.unsplash\.com\/photo-1544947950-fa07a98d237f\?q=80&w=600"/,
                      `src="${selectedItem.thumbnail}"`,
                    );
                  }
                  if (selectedItem.description) {
                    updatedDesc = updatedDesc.replace(
                      /<p>\s*Nhập phần giới thiệu ngắn gọn[\s\S]*?<\/p>/,
                      `<p>${selectedItem.description}</p>`,
                    );
                  }
                  setValue("description", updatedDesc, { shouldDirty: true });

                  // Gọi hàm AI Groq riêng biệt gọn gàng
                  handleAIGenerateDescription(
                    selectedItem.name,
                    selectedItem.description || "",
                  );

                  if (selectedItem.thumbnail && coverImages.length === 0) {
                    setValue(
                      "coverImages",
                      [{ url: selectedItem.thumbnail, isThumbnail: true }],
                      { shouldDirty: true, shouldValidate: true },
                    );
                  }
                  trigger(["price", "originalPrice"]);
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
                    validate: (value) =>
                      !getValues("price") ||
                      Number(value) <= Number(getValues("price")) ||
                      "Giá nhập không được lớn hơn giá bán",
                    onChange: () => trigger("price"),
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
                    validate: (value) =>
                      !getValues("originalPrice") ||
                      Number(value) >= Number(getValues("originalPrice")) ||
                      "Giá bán không được nhỏ hơn giá nhập",
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
                    min: {
                      value: 0,
                      message: "Số lượng phải lớn hơn hoặc bằng 0",
                    },
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
            />
          )}
        />
      </div>
    </form>
  );
}
