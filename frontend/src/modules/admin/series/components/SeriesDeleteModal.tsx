import Modal from "@/components/common/Modal";
import type { SeriesResponse } from "@/types/series";

interface SeriesDeleteModalProps {
  isOpen: boolean;
  series: SeriesResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function SeriesDeleteModal({
  isOpen,
  series,
  onClose,
  onConfirm,
}: SeriesDeleteModalProps) {
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
        {series && (
          <p className="text-base text-slate-700">
            Bạn có chắc chắn muốn xóa tác giả{" "}
            <span className="font-bold text-slate-900">
              "{series.name}"
            </span>
            ?
          </p>
        )}
      </div>
    </Modal>
  );
}