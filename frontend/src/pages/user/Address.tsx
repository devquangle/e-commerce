import Loading from "@/components/common/Loading";

import AddressCard from "@/modules/user/address/components/AddressCard";
import AddressHeader from "@/modules/user/address/components/AddressHeader";
import DeleteAddress from "@/modules/user/address/components/DeleteAddress";
import DefaultAddress from "@/modules/user/address/components/DefaultAddress";
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from "@/modules/user/address/hooks/useAddress";
import type { AddressResponse } from "@/modules/user/address/types/address";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Address() {
  const { data: addresses = [], isFetching } = useAddresses();
  const deleteMutation = useDeleteAddress();
  const defaultMutation = useSetDefaultAddress();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenDefault, setIsOpenDefault] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);

  const navigation = useNavigate();

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
  if (isFetching) return <Loading />;
  return (
    <>
      <div className="flex-1 p-2">
        <AddressHeader />

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
