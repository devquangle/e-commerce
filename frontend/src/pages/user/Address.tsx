import Loading from "@/components/common/Loading";
import AddressCard from "@/components/user/address/AddressCard";
import addressService from "@/services/addressService";
import type { AddressFrom } from "@/types/address";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Address() {
  const [addresses, setAddresses] = useState<AddressFrom[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const lists = async () => {
      setIsLoading(true);
      try {
        const res = await addressService.fetchAddresses();
        if (res.success) {
          setAddresses(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    lists();
  }, []);


  const handleSetDefault = async (id: number) => {
  };

  const handleEdit = async (id: number) => { };

  const handleDelete = async (id: number) => {
  };


  return (

    <>
      {isLoading && <Loading />}
      <div className="flex-1 p-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Danh sách địa chỉ</h2>
          <NavLink
            to="/account/create-address"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Thêm địa chỉ mới
          </NavLink>
        </div>

        {/* Grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {addresses.map(item => (
            <AddressCard
              key={item.id}
              item={item}
              onSetDefault={handleSetDefault}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

          ))}
        </div>
      </div>
    </>


  );
}
