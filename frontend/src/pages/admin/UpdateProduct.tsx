import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FileText } from "lucide-react";

import ProductHeaderAdd from "@/modules/admin/product/components/ProductHeaderAdd";
import ProductBasicInfo from "@/modules/admin/product/components/ProductBasicInfo";
import ProductAttribute from "@/modules/admin/product/components/ProductAttribute";
import ProductDescriptionEditor from "@/modules/admin/product/components/ProductDescriptionEditor";
import MultipleImageUpload from "@/components/common/MultipleImageUploadProps";
import Loading from "@/components/common/Spinner";

import { useBookFormData } from "@/hooks/useBookFormData";
import imageService from "@/services/imageService";
import { showWarningToast } from "@/utils/toastUtil";

import type { ImageProductRequest } from "@/types/image";
import type { ProductRequest } from "@/modules/admin/product/types/product.type";
import {
  useProductById,
  useUpdateProduct,
} from "@/modules/admin/product/hooks/useProduct";

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
  isbn: "0000000000000",
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

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : undefined;

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
    isLoading: isFormLoading,
    isError,
  } = useBookFormData();

  const { data: productData, isLoading: isProductLoading } =
    useProductById(productId);
  const updateMutation = useUpdateProduct();
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingAI, setIsFetchingAI] = useState(false);
  const isLoading = isFormLoading || isProductLoading;

  // Watch các trường dữ liệu
  const coverImagesRaw = useWatch({ name: "coverImages", control });
  const coverImages = useMemo(() => coverImagesRaw || [], [coverImagesRaw]);
  const inputName = useWatch({ control, name: "name" }) || "";

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

  // Load dữ liệu sản phẩm vào form khi productData sẵn sàng
  useEffect(() => {
    if (!productData) return;
    const formValues: typeof INITIAL_FORM = {
      name: productData.name,
      isbn: productData.isbn,
      originalPrice: productData.originalPrice,
      price: productData.price,
      quantity: productData.quantity,
      weight: productData.weight,
      publishYear: productData.publishYear,
      pages: productData.pages,
      language: productData.language || "vi",
      authorIds: productData.authorIds ?? [],
      genreIds: productData.genreIds ?? [],
      publisherId: productData.publisherId ?? undefined,
      seriesId: productData.seriesId ?? undefined,
      status: "ACTIVE",
      coverImages:
        productData.coverImages?.map((img) => ({
          url: img.url,
          isThumbnail: img.isThumbnail,
        })) ?? [],
      description: productData.description,
    };
    reset(formValues);
  }, [productData, reset]);

  // Xử lý Submit Form chính
  const onSubmit = async (data: ProductRequest) => {
    if (!productId) return;
    try {
      if (!coverImages.length) {
        showWarningToast("Vui lòng thêm ít nhất một ảnh sản phẩm!");
        return;
      }

      setIsSaving(true);

      // Chỉ upload những ảnh mới (blob:) — ảnh cũ (https:) giữ nguyên URL
      const uploadedImages: ImageProductRequest[] = await Promise.all(
        coverImages.map(async (img) => {
          if (img.file || img.url?.startsWith("blob:")) {
            const results = await imageService.uploadImage([img]);
            return results[0];
          }
          return img;
        }),
      );

      await updateMutation.mutateAsync({
        id: productId,
        req: { ...data, coverImages: uploadedImages },
      });

      navigate("/admin/products");
    } catch {
      // lỗi đã được xử lý trong hook useUpdateProduct
    } finally {
      setIsSaving(false);
    }
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
    <form
      id="create-product-form"
      onSubmit={handleSubmit(onSubmit)}
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
        title={`Cập nhật sản phẩm${productData ? ` — ${productData.name}` : ""}`}
        subtitle="Chỉnh sửa thông tin chi tiết và cập nhật dữ liệu cho sản phẩm sách."
        onBack={() => navigate("/admin/products")}
        onReset={handleReset}
        isSubmitting={updateMutation.isPending || isSaving}
        submitButtonText="Lưu thay đổi"
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
      <Controller
        name="coverImages"
        control={control}
        render={({ field }) => (
          <MultipleImageUpload
            images={field.value || []}
            onChange={(imgs) =>
              setValue("coverImages", imgs, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            isSubmitted={isSubmitted}
          />
        )}
      />

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
    </form>
  );
}
