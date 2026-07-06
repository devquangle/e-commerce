import Modal from "@/components/common/Modal";

interface DeleteCartItemModalProps {
  isOpen: boolean;
  productName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCartItemModal({
  isOpen,
  productName,
  onClose,
  onConfirm,
}: DeleteCartItemModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa sản phẩm"
      cancelText="Hủy"
      confirmText="Xóa"
    >
      <p className="text-sm text-slate-600">
        Bạn có chắc chắn muốn xóa{" "}
        <strong>"{productName}"</strong> khỏi giỏ hàng không?
      </p>
    </Modal>
  );
}