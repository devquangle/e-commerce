import React from "react";
import Modal from "@/components/common/Modal";
import type { VoucherResponse } from "../types/voucher.type";

interface VoucherDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voucher: VoucherResponse | null;
}

const VoucherDeleteModal: React.FC<VoucherDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  voucher,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận xóa Voucher"
      confirmText="Xóa"
      cancelText="Hủy"
      size="md"
    >
      <div className="flex flex-col items-center gap-4 text-center mt-2">
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <div className="py-2">
          {voucher && (
            <p className="text-base text-slate-700">
              Bạn có chắc chắn muốn xóa voucher {" "}
              <span className="font-bold text-slate-900">"{voucher.code}"</span>
              ?
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VoucherDeleteModal;
