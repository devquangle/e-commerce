import { useState } from "react";

type AddressItem = {
  id: number;
  fullname: string;
  phone: string;
  address: string;
  default: boolean;
};

export default function Address() {
  const [addresses, setAddresses] = useState<AddressItem[]>([
    { id: 1, fullname: "Nguyen Van A", phone: "0901234567", address: "123 Đường ABC, Quận 1, TP.HCM", default: true },
    { id: 2, fullname: "Tran Thi B", phone: "0912345678", address: "456 Đường XYZ, Quận 3, TP.HCM", default: false },
    { id: 3, fullname: "Le Van C", phone: "0923456789", address: "789 Đường DEF, Quận 5, TP.HCM", default: false },
  ]);

  return (
    <div className="flex-1 p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Danh sách địa chỉ</h2>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Thêm địa chỉ mới
        </button>
      </div>

      {/* Grid responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {addresses.map(item => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 flex flex-col justify-between shadow-sm transition hover:shadow-md
              ${item.default ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}
            `}
          >
            <div className="space-y-1">
              <p className="font-medium text-gray-800">{item.fullname}</p>
              <p className="text-gray-600">{item.phone}</p>
              <p className="text-gray-600">{item.address}</p>
            </div>

            <div className="flex items-center gap-2 mt-3">
              {item.default ? (
                <span className="px-2 py-1 text-xs text-white bg-blue-500 rounded">Mặc định</span>
              ) : (
                <button
                  className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Đặt mặc định
                </button>
              )}

              <button
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sửa
              </button>
              <button
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
