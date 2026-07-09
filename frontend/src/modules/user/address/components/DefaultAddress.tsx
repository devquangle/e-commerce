import Modal from "@/components/common/Modal";
import type { AddressResponse } from "@/modules/user/address/types/address";

interface DefaultAddressProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedAddress: AddressResponse | null;
}

export default function DefaultAddress({
  isOpen,
  onClose,
  onConfirm,
  selectedAddress,
}: DefaultAddressProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận đặt làm địa chỉ mặc định"
      onConfirm={onConfirm}
      confirmText="Đặt làm mặc định"
      cancelText="Hủy"
    >
      {selectedAddress && (
        <div className="text-gray-700">
          Bạn có chắc muốn đặt địa chỉ này làm địa chỉ mặc định?
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
