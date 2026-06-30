import Modal from "@/components/common/Modal";
import type { ProductResponse } from "../types/product.type";

interface ProductDeleteModalProps {
  isOpen: boolean;
  product: ProductResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function ProductDeleteModal({
  isOpen,
  product,
  onClose,
  onConfirm,
}: ProductDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xóa sản phẩm"
      onConfirm={onConfirm}
      confirmText="Xóa sản phẩm"
      cancelText="Hủy"
    >
      <div className="py-2">
        {product && (
          <p className="text-base text-slate-700">
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <span className="font-bold text-slate-900">
              "{product.name}"
            </span>
            ?
          </p>
        )}
      </div>
    </Modal>
  );
}