import { useMemo } from "react";
import {
  Controller,
  useWatch,
  type Control,
  type UseFormRegister,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormGetValues,
  type UseFormTrigger,
} from "react-hook-form";
import { BookOpen } from "lucide-react";

import SelectBox from "@/components/common/SelectedBox";
import InputField from "@/components/common/InputField";
import SearchInput from "@/components/common/SearchInput";

import { registerLocale, getNames } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";

import { useFilterGoogleBook } from "@/hooks/useGoogleBook";
import { useBookFormData } from "@/hooks/useBookFormData";
import useDebounce from "@/hooks/useDebounce";

import { useProductSearchApi } from "@/modules/admin/product/hooks/useProductSearchApi";
import { useGemini } from "@/modules/admin/product/hooks/useGemini";

import { showSuccessToast, showWarningToast } from "@/utils/toastUtil";

import type { ImageProductRequest } from "@/types/image";
import type { GoogleBookResponse } from "@/types/googlebook";
import type { ProductRequest } from "@/modules/admin/product/types/product.type";

const MAX_IMAGES = 6;

const INITIAL_FORM_FALLBACK = {
  pages: 200,
  publishYear: "2020-01-01",
  isbn: "",
  language: "vi",
  price: 300000,
  originalPrice: 200000,
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

interface ProductBasicInfoProps {
  register: UseFormRegister<ProductRequest>;
  control: Control<ProductRequest>;
  errors: FieldErrors<ProductRequest>;
  setValue: UseFormSetValue<ProductRequest>;
  getValues: UseFormGetValues<ProductRequest>;
  trigger: UseFormTrigger<ProductRequest>;
  setIsFetchingAI: (isFetching: boolean) => void;
}

export default function ProductBasicInfo({
  register,
  control,
  errors,
  setValue,
  getValues,
  trigger,
  setIsFetchingAI,
}: ProductBasicInfoProps) {
  const { authorsData = [] } = useBookFormData();
  const { mutateAsync: fetchSearchApiImages } = useProductSearchApi();
  const { mutateAsync: fetchGeminiBookMeta } = useGemini();

  const inputName = useWatch({ control, name: "name" }) || "";
  const debouncedName = useDebounce(inputName, 1000);
  const watchedPrice = useWatch({ control, name: "price" });
  const watchedOriginalPrice = useWatch({ control, name: "originalPrice" });

  const { data: googleBooks = [], isFetching: isLoadingGoogleBooks } =
    useFilterGoogleBook(debouncedName);

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

  return (
    <div className="col-span-12 xl:col-span-7 space-y-6 xl:h-full">
      <div className="card-custom space-y-5 xl:h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <BookOpen size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Thông tin sách cơ bản
            </h2>
          </div>

          <div className="grid gap-4 mt-4">
            <div>
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
                  setValue("name", selectedItem.name, {
                    shouldDirty: true,
                  });

                  setValue(
                    "pages",
                    selectedItem.pageCount || INITIAL_FORM_FALLBACK.pages,
                    {
                      shouldDirty: true,
                    },
                  );

                  let dateValue = INITIAL_FORM_FALLBACK.publishYear;
                  if (selectedItem.publishedDate) {
                    dateValue = selectedItem.publishedDate;
                    if (/^\d{4}$/.test(dateValue))
                      dateValue = `${dateValue}-01-01`;
                    else if (/^\d{4}-\d{2}$/.test(dateValue))
                      dateValue = `${dateValue}-01`;
                  }
                  setValue("publishYear", dateValue, { shouldDirty: true });

                  setValue(
                    "isbn",
                    selectedItem.isbn || INITIAL_FORM_FALLBACK.isbn,
                    {
                      shouldDirty: true,
                    },
                  );
                  setValue(
                    "language",
                    selectedItem.language || INITIAL_FORM_FALLBACK.language,
                    {
                      shouldDirty: true,
                    },
                  );

                  setValue(
                    "price",
                    selectedItem.listPrice || INITIAL_FORM_FALLBACK.price,
                    {
                      shouldDirty: true,
                    },
                  );
                  setValue(
                    "originalPrice",
                    selectedItem.retailPrice ||
                      INITIAL_FORM_FALLBACK.originalPrice,
                    {
                      shouldDirty: true,
                    },
                  );

                  // 2. Set description với dữ liệu Google Books
                  let updatedDesc =
                    getValues("description") || INITIAL_FORM_FALLBACK.description;
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
                  }

                  setValue("description", updatedDesc, {
                    shouldDirty: true,
                  });

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

                      setValue("description", newDesc, {
                        shouldDirty: true,
                      });
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
            </div>

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
  );
}
