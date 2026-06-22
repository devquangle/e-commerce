import Modal from "@/components/common/Modal";
import type { PublisherResponse } from "@/types/publisher";

interface PublisherDeleteModalProps {
  isOpen: boolean;
  publisher: PublisherResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function PublisherDeleteModal({
  isOpen,
  publisher,
  onClose,
  onConfirm,
}: PublisherDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xóa tác giả"
      onConfirm={onConfirm}
      confirmText="Xóa tác giả"
      cancelText="Hủy"
    >
      <div className="py-2">
        {publisher && (
          <p className="text-base text-slate-700">
            Bạn có chắc chắn muốn xóa tác giả{" "}
            <span className="font-bold text-slate-900">
              "{publisher.name}"
            </span>
            ?
          </p>
        )}
      </div>
    </Modal>
  );
}