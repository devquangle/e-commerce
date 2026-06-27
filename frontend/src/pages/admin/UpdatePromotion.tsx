import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UpdatePromotionHeader from "@/modules/admin/promotion/components/UpdatePromotionHeader";
import PromotionForm from "@/modules/admin/promotion/components/PromotionForm";
import PromotionProductSelector from "@/modules/admin/promotion/components/PromotionProductSelector";
import type { PromotionRequest, PromotionResponse } from "@/modules/admin/promotion/types/promotion.type";
import { BaseStatus } from "@/types/status";
import { showSuccessToast } from "@/utils/toastUtil";

export default function UpdatePromotion() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([101, 104]);

  const dummyPromo: PromotionResponse = {
    id: Number(id) || 1,
    name: "Ưu đãi đón hè rực rỡ",
    discountValue: 10,
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    status: BaseStatus.ACTIVE,
    promotionCampaignType: "PRODUCT_DISCOUNT",
  };

  const handleSubmit = (data: PromotionRequest) => {
    showSuccessToast(`Đã cập nhật khuyến mãi "${data.name}" thành công!`);
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
      <PromotionForm
        initialData={dummyPromo}
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
