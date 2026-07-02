import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CreatePromotionHeader from "@/modules/admin/promotion/components/CreatePromotionHeader";
import PromotionForm from "@/modules/admin/promotion/components/PromotionForm";
import PromotionProductSelector from "@/modules/admin/promotion/components/PromotionProductSelector";
import type { PromotionRequest, PromotionProductResponse } from "@/modules/admin/promotion/types/promotion.type";
import { useCreatePromotion } from "@/modules/admin/promotion/hooks/usePromotion";
import { showErrorToast } from "@/utils/toastUtil";

export default function CreatePromotion() {
  const navigate = useNavigate();
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [promotionProductsData, setPromotionProductsData] = useState<PromotionProductResponse[]>([]);
  const [promoDates, setPromoDates] = useState<{ startDate: string; endDate: string }>({ startDate: "", endDate: "" });
  const [hasProductValidationError, setHasProductValidationError] = useState(false);
  const createMutation = useCreatePromotion();

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

    createMutation.mutate(fullRequest, {
      onSuccess: () => {
        navigate("/admin/promotions");
      },
    });
  };

  const handleCancel = () => {
    navigate("/admin/promotions");
  };

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
      {/* HEADER */}
      <CreatePromotionHeader onBack={handleCancel} />

      {/* FORM THÔNG TIN CHUNG KHUYẾN MÃI */}
      <PromotionForm initialData={null} onSubmit={handleSubmit} onValuesChange={setPromoDates} />

      {/* DANH SÁCH SẢN PHẨM ÁP DỤNG */}
      <PromotionProductSelector
        selectedIds={selectedProductIds}
        onChange={setSelectedProductIds}
        onProductsDataChange={handleProductsDataChange}
        promoStartDate={promoDates.startDate}
        promoEndDate={promoDates.endDate}
        onValidationErrorChange={setHasProductValidationError}
      />
    </div>
  );
}
