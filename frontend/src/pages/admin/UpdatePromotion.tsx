import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UpdatePromotionHeader from "@/modules/admin/promotion/components/UpdatePromotionHeader";
import PromotionForm from "@/modules/admin/promotion/components/PromotionForm";
import PromotionProductSelector from "@/modules/admin/promotion/components/PromotionProductSelector";
import type { PromotionRequest, PromotionResponse, PromotionProducts } from "@/modules/admin/promotion/types/promotion.type";
import { BaseStatus } from "@/types/status";
import { showSuccessToast } from "@/utils/toastUtil";

export default function UpdatePromotion() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([1, 2]);
  const [promotionProductsData, setPromotionProductsData] = useState<PromotionProducts[]>([]);

  const handleProductsDataChange = useCallback((products: PromotionProducts[]) => {
    setPromotionProductsData(products);
  }, []);

  const dummyPromo: PromotionResponse = {
    id: Number(id) || 1,
    name: "Ưu đãi đón hè rực rỡ",
    discountValue: 10,
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    status: BaseStatus.ACTIVE,
    promotionCampaignType: "PRODUCT_DISCOUNT",
  };

  const handleSubmit = (formData: PromotionRequest) => {
    const fullRequest: PromotionRequest = {
      ...formData,
      promotionProducts: promotionProductsData,
    };

    console.log("=== UPDATE PROMOTION REQUEST ===", fullRequest);
    console.log("=== PROMOTION PRODUCTS (ĐƯỢC CHECKED) ===", fullRequest.promotionProducts);

    showSuccessToast(`Đã cập nhật khuyến mãi "${fullRequest.name}" thành công! Xem Console log.`);
    navigate("/admin/promotions");
  };

  const handleCancel = () => {
    navigate("/admin/promotions");
  };

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
      {/* HEADER */}
      <UpdatePromotionHeader id={id} onBack={handleCancel} />

      {/* FORM THÔNG TIN CHUNG KHUYẾN MÃI */}
      <PromotionForm initialData={dummyPromo} onSubmit={handleSubmit} />

      {/* DANH SÁCH SẢN PHẨM ÁP DỤNG */}
      <PromotionProductSelector
        selectedIds={selectedProductIds}
        onChange={setSelectedProductIds}
        onProductsDataChange={handleProductsDataChange}
      />
    </div>
  );
}
