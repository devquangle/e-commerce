import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CreatePromotionHeader from "@/modules/admin/promotion/components/CreatePromotionHeader";
import PromotionForm from "@/modules/admin/promotion/components/PromotionForm";
import PromotionProductSelector from "@/modules/admin/promotion/components/PromotionProductSelector";
import type { PromotionRequest, PromotionProducts } from "@/modules/admin/promotion/types/promotion.type";
import { showSuccessToast } from "@/utils/toastUtil";

export default function CreatePromotion() {
  const navigate = useNavigate();
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [promotionProductsData, setPromotionProductsData] = useState<PromotionProducts[]>([]);

  const handleProductsDataChange = useCallback((products: PromotionProducts[]) => {
    setPromotionProductsData(products);
  }, []);

  const handleSubmit = (formData: PromotionRequest) => {
    const fullRequest: PromotionRequest = {
      ...formData,
      promotionProducts: promotionProductsData,
    };

    console.log("=== PROMOTION REQUEST ===", fullRequest);
    console.log("=== PROMOTION PRODUCTS (ĐƯỢC CHECKED) ===", fullRequest.promotionProducts);

    showSuccessToast(
      `Đã tạo khuyến mãi "${fullRequest.name}" cho ${fullRequest.promotionProducts.length} sản phẩm thành công! Xem Console log.`
    );
    navigate("/admin/promotions");
  };

  const handleCancel = () => {
    navigate("/admin/promotions");
  };

  return (
    <div className="flex-1 grid grid-cols-1 gap-4 auto-rows-max">
      {/* HEADER */}
      <CreatePromotionHeader onBack={handleCancel} />

      {/* FORM THÔNG TIN CHUNG KHUYẾN MÃI */}
      <PromotionForm initialData={null} onSubmit={handleSubmit} />

      {/* DANH SÁCH SẢN PHẨM ÁP DỤNG */}
      <PromotionProductSelector
        selectedIds={selectedProductIds}
        onChange={setSelectedProductIds}
        onProductsDataChange={handleProductsDataChange}
      />
    </div>
  );
}
