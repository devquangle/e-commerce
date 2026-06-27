import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatePromotionHeader from "@/modules/admin/promotion/components/CreatePromotionHeader";
import PromotionForm from "@/modules/admin/promotion/components/PromotionForm";
import PromotionProductSelector from "@/modules/admin/promotion/components/PromotionProductSelector";
import type { PromotionRequest } from "@/modules/admin/promotion/types/promotion.type";
import { showSuccessToast } from "@/utils/toastUtil";

export default function CreatePromotion() {
  const navigate = useNavigate();
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([101, 102]);

  const handleSubmit = (data: PromotionRequest) => {
    showSuccessToast(`Đã tạo khuyến mãi "${data.name}" cho ${selectedProductIds.length} sản phẩm thành công!`);
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
      <PromotionForm
        initialData={null}
        onSubmit={handleSubmit}
      />

      {/* DANH SÁCH SẢN PHẨM ÁP DỤNG */}
      <PromotionProductSelector
        selectedIds={selectedProductIds}
        onChange={setSelectedProductIds}
      />
    </div>
  );
}
