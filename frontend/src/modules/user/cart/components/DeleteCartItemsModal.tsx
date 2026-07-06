import Modal from "@/components/common/Modal";

interface DeleteCartItemsModalProps {
  isOpen: boolean;
  itemCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCartItemsModal({
  isOpen,
  itemCount,
  onClose,
  onConfirm,
}: DeleteCartItemsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa các sản phẩm đã chọn"
      cancelText="Hủy"
      confirmText="Xóa"
    >
      <p className="text-sm text-slate-600">
        Bạn có chắc chắn muốn xóa <strong>{itemCount} sản phẩm</strong> đã chọn
        khỏi giỏ hàng không?
      </p>

      <p className="mt-2 text-sm text-red-500">
        Hành động này không thể hoàn tác.
      </p>
    </Modal>
  );
}
