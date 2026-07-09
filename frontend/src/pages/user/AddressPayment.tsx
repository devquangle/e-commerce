import Container from "@/components/common/Container";
import AddressCard from "@/modules/user/address/components/AddressCard";
import FormAddAddress from "@/modules/user/address/components/FormAddAddress";
import FormUpdateAddress from "@/modules/user/address/components/FormUpdateAddress";
import DeleteAddress from "@/modules/user/address/components/DeleteAddress";
import DefaultAddress from "@/modules/user/address/components/DefaultAddress";
import type { AddressResponse } from "@/modules/user/address/types/address";
import {
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/modules/user/address/hooks/useAddress";
import Loading from "@/components/common/Loading";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const STORAGE_KEY = "payment_selected_address_id";

export default function AddressPayment() {
  const navigate = useNavigate();
  const { data: addresses = [], isFetching } = useAddresses();
  const deleteMutation = useDeleteAddress();
  const defaultMutation = useSetDefaultAddress();

  const [action, setAction] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenDefault, setIsOpenDefault] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponse | null>(null);

  const savedId = Number(localStorage.getItem(STORAGE_KEY));
  const initialId =
    addresses.find((a) => a.id === savedId)?.id ??
    addresses.find((a) => a.default)?.id ??
    addresses[0]?.id;

  const handleSelect = (id: number) => {
    localStorage.setItem(STORAGE_KEY, String(id));
    navigate("/payment");
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setAction("edit");
  };

  const handleCloseDelete = () => {
    setIsOpenDelete(false);
    setSelectedAddress(null);
  };

  const handleCloseDefault = () => {
    setIsOpenDefault(false);
    setSelectedAddress(null);
  };

  const handleDelete = (id: number) => {
    const found = addresses.find((a) => a.id === id);
    if (found) {
      setSelectedAddress(found);
      setIsOpenDelete(true);
    }
  };

  const handleSetDefault = (id: number) => {
    const found = addresses.find((a) => a.id === id);
    if (found) {
      setSelectedAddress(found);
      setIsOpenDefault(true);
    }
  };

  const confirmDelete = () => {
    if (!selectedAddress) return;
    deleteMutation.mutate(selectedAddress.id, {
      onSuccess: () => handleCloseDelete(),
    });
  };

  const confirmSetDefault = () => {
    if (!selectedAddress) return;
    defaultMutation.mutate(selectedAddress.id, {
      onSuccess: () => handleCloseDefault(),
    });
  };

  if (isFetching) return <Loading />;

  return (
    <>
      <Container className="max-w-7xl px-4 md:px-6 py-6 md:py-10">
        <div className="flex items-center gap-2 mb-6">
          <MapPin size={24} className="text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">
            Chọn địa chỉ giao hàng
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              item={addr}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              isPayment={true}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {addresses.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới để tiếp tục thanh
            toán.
          </div>
        )}

        {action === "list" && (
          <div className="mt-6">
            <p className="text-gray-700">
              Bạn muốn giao hàng đến địa chỉ khác?{" "}
              <button
                onClick={() => setAction("add")}
                className="text-[#00a1ff] hover:underline font-medium"
              >
                Thêm địa chỉ giao hàng mới
              </button>
            </p>
          </div>
        )}

        {action === "add" && (
          <div className="card-custom mt-8 border-t animate-fade-in-down">
            <h2 className="text-lg font-semibold mb-4">
              Thêm địa chỉ giao hàng mới
            </h2>
            <FormAddAddress
              onSuccess={() => setAction("list")}
              onCancel={() => setAction("list")}
            />
          </div>
        )}

        {action === "edit" && editingId && (
          <div className="card-custom mt-8 border-t animate-fade-in-down">
            <h2 className="text-lg font-semibold mb-4">Cập nhật địa chỉ</h2>
            <FormUpdateAddress
              addressId={editingId}
              onSuccess={() => setAction("list")}
              onCancel={() => setAction("list")}
            />
          </div>
        )}
      </Container>

      <DeleteAddress
        isOpen={isOpenDelete}
        onClose={handleCloseDelete}
        onConfirm={confirmDelete}
        selectedAddress={selectedAddress}
      />
      <DefaultAddress
        isOpen={isOpenDefault}
        onClose={handleCloseDefault}
        onConfirm={confirmSetDefault}
        selectedAddress={selectedAddress}
      />
    </>
  );
}

export { STORAGE_KEY as PAYMENT_ADDRESS_STORAGE_KEY };
