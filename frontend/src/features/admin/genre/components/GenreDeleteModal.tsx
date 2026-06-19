import Modal from "@/components/common/Modal";
import type { GenreResponse } from "../types/genre.type";

interface GenreDeleteModalProps {
  isOpen: boolean;
  genre: GenreResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function GenreDeleteModal({
  isOpen,
  genre,
  onClose,
  onConfirm,
}: GenreDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xóa thể loại"
      onConfirm={onConfirm}
      confirmText="Xóa thể loại"
      cancelText="Hủy"
    >
      <div className="py-2">
        {genre && (
          <p className="text-base text-slate-700">
            Bạn có chắc chắn muốn xóa thể loại{" "}
            <span className="font-bold text-slate-900">
              "{genre.name}"
            </span>
            ?
          </p>
        )}
      </div>
    </Modal>
  );
}