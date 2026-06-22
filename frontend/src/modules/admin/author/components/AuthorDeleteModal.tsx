import Modal from "@/components/common/Modal";
import type { AuthorResponse } from "@/types/author";

interface AuthorDeleteModalProps {
  isOpen: boolean;
  author: AuthorResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function AuthorDeleteModal({
  isOpen,
  author,
  onClose,
  onConfirm,
}: AuthorDeleteModalProps) {
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
        {author && (
          <p className="text-base text-slate-700">
            Bạn có chắc chắn muốn xóa tác giả{" "}
            <span className="font-bold text-slate-900">
              "{author.name}"
            </span>
            ?
          </p>
        )}
      </div>
    </Modal>
  );
}