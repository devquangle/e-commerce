import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UpdatePromotionHeader from "@/modules/admin/promotion/components/UpdatePromotionHeader";
import PromotionForm from "@/modules/admin/promotion/components/PromotionForm";
import PromotionProductSelector from "@/modules/admin/promotion/components/PromotionProductSelector";
import type { PromotionRequest, PromotionProductResponse } from "@/modules/admin/promotion/types/promotion.type";
import { useGetPromotionDetail, useUpdatePromotion } from "@/modules/admin/promotion/hooks/usePromotion";
import Loading from "@/components/common/Loading";
import { showErrorToast } from "@/utils/toastUtil";

export default function UpdatePromotion() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const promoId = Number(id);

  const { data: promotion, isLoading } = useGetPromotionDetail(promoId);
  const updateMutation = useUpdatePromotion();

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [promotionProductsData, setPromotionProductsData] = useState<PromotionProductResponse[]>([]);
  const [promoDates, setPromoDates] = useState<{ startDate: string; endDate: string }>({ startDate: "", endDate: "" });
  const [hasProductValidationError, setHasProductValidationError] = useState(false);

  // Đồng bộ sản phẩm từ DB sang local state khi tải xong
  useEffect(() => {
    if (promotion?.promotionProducts) {
      // eslint-disable-next-line
      setSelectedProductIds(promotion.promotionProducts.map((p) => p.productId));
      setPromotionProductsData(promotion.promotionProducts);
    }
  }, [promotion]);

  const handleProductsDataChange = useCallback((products: PromotionProductResponse[]) => {
    setPromotionProductsData(products);
  }, []);

  const handleSubmit = (formData: PromotionRequest) => {
    if (hasProductValidationError) {
      showErrorToast("Có sản phẩm vượt quá số lượng khả dụng. Vui lòng kiểm tra lại!");
      return;
    }

    const fullRequest: PromotionRequest = {
      ...formData,
      promotionProducts: promotionProductsData,
    };

    updateMutation.mutate(
      { id: promoId, req: fullRequest },
      {
        onSuccess: () => {
          navigate("/admin/promotions");
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/admin/promotions");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
      {/* HEADER */}
      <UpdatePromotionHeader id={id} onBack={handleCancel} />

      {/* FORM THÔNG TIN CHUNG KHUYẾN MÃI */}
      <PromotionForm initialData={promotion} onSubmit={handleSubmit} onValuesChange={setPromoDates} />

      {/* DANH SÁCH SẢN PHẨM ÁP DỤNG */}
      <PromotionProductSelector
        selectedIds={selectedProductIds}
        onChange={setSelectedProductIds}
        onProductsDataChange={handleProductsDataChange}
        initialProducts={promotion?.promotionProducts}
        promoStartDate={promoDates.startDate}
        promoEndDate={promoDates.endDate}
        currentPromotionId={promoId}
        onValidationErrorChange={setHasProductValidationError}
      />
    </div>
  );
}
