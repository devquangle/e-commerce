import Loading from "@/components/common/Loading";

import Modal from "@/components/common/Modal";
import AddressCard from "@/components/user/AddressCard";
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from "@/hooks/useAddress";
import type { AddressResponse } from "@/types/address";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Address() {
  const { data: addresses = [], isLoading } = useAddresses();
  const deleteMutation = useDeleteAddress();
  const defaultMutation = useSetDefaultAddress();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenDefault, setIsOpenDefault] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);

  const navigation = useNavigate();
  const navigate = useNavigate();

  const handleCloseDelete = () => {
    setIsOpenDelete(false);
    setSelectedAddress(null);
  };
  const handleCloseDefault = () => {
    setIsOpenDefault(false);
    setSelectedAddress(null);
  };


  const handleSelectedAddressDefault = (id: number) => {
    const found = addresses.find(a => a.id === id);
    if (found) {
      setSelectedAddress(found);
      setIsOpenDefault(true);
    }
  };



  const handleEdit = async (id: number) => {
    navigation(`/account/edit-address/${id}`);
  };

  const handleSelectedAddress = (id: number) => {
    const found = addresses.find(a => a.id === id);
    if (found) {
      setSelectedAddress(found);
      setIsOpenDelete(true);
    }
  };


  const confirmDelete = () => {
    if (!selectedAddress) return;

    deleteMutation.mutate(selectedAddress.id, {
      onSuccess: () => {
        handleCloseDelete();
      },
    });
  };
  const confirmSetDefault = () => {
    if (!selectedAddress) return;

    defaultMutation.mutate(selectedAddress.id, {
      onSuccess: () => {
        handleCloseDefault();
      },
    });
  };
  if (isLoading) return <Loading />;
  return (

    <>
      <div className="flex-1 p-2">

        <div className="flex justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách địa chỉ
          </h2>

          <button
            type="button"
            onClick={() => navigate("/account/create-address")}
            className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer transition"
          >
            {/* Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>

            {/* Text */}
            <span className="hidden lg:inline">
              Thêm địa chỉ mới
            </span>
          </button>
        </div>

        {/* Grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {addresses.map(item => (
            <AddressCard
              key={item.id}
              item={item}
              onSetDefault={() => handleSelectedAddressDefault(item.id)}
              onEdit={handleEdit}
              onDelete={() => handleSelectedAddress(item.id)}
            />

          ))}
        </div>
      </div>
      <Modal
        isOpen={isOpenDelete}
        onClose={handleCloseDelete}
        title="Xác nhận xóa địa chỉ?"
        onConfirm={confirmDelete}
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
      <Modal
        isOpen={isOpenDefault}
        onClose={handleCloseDefault}
        title="Xác nhận đặt làm địa chỉ mặc định"
        onConfirm={confirmSetDefault}
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
    </>


  );
}
