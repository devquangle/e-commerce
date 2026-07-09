import Modal from "@/components/common/Modal";
import type { AddressResponse } from "@/modules/user/address/types/address";

interface DeleteAddressProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedAddress: AddressResponse | null;
}

export default function DeleteAddress({
  isOpen,
  onClose,
  onConfirm,
  selectedAddress,
}: DeleteAddressProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa địa chỉ?"
      onConfirm={onConfirm}
      confirmText="Xóa"
      cancelText="Hủy"
    >
      {selectedAddress && (
        <div className="text-gray-700">
          Bạn có chắc muốn xóa địa chỉ
          <div className="mt-2 p-3 bg-gray-100 rounded">
            <p>Họ và tên: {selectedAddress.fullName}</p>
            <p>Số điện thoại: {selectedAddress.phone}</p>
            <p>Địa chỉ: {selectedAddress.streetFull}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
