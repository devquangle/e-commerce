import React from "react";
import { useParams } from "react-router-dom";

/* ===== TYPES ===== */
type ProductItem = {
  image: string;
  title: string;
  price: number;
  priceOld: number;
  quantity: number;
};

type OrderItem = {
  id: number;
  fullname: string;
  phone: string;
  address: string;
  total: number;
  status: "Đang xử lý" | "Đang giao" | "Hoàn thành" | "Đã hủy";
  paymentMethod: "Tiền mặt" | "Ví điện tử" | "Thẻ tín dụng";
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán";
  date: string;
  products: ProductItem[];
};

/* ===== MOCK DATA ===== */
const mockOrders: OrderItem[] = [
  {
    id: 1,
    fullname: "Nguyễn Văn A",
    phone: "0123 456 789",
    address: "Quận 1, TP.HCM",
    total: 1250000,
    status: "Đang xử lý",
    paymentMethod: "Ví điện tử",
    paymentStatus: "Đã thanh toán",
    date: "2026-01-06",
    products: [
      {
        image: "https://via.placeholder.com/60",
        title: "Áo thun nam",
        price: 250000,
        priceOld: 300000,
        quantity: 2,
      },
      {
        image: "https://via.placeholder.com/60",
        title: "Quần jean",
        price: 750000,
        priceOld: 850000,
        quantity: 1,
      },
    ],
  },
];

/* ===== COMPONENT ===== */
export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const order = mockOrders.find(o => o.id === Number(id));

  if (!order) {
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        Không tìm thấy đơn hàng
      </div>
    );
  }

  const statusColor =
    order.status === "Hoàn thành"
      ? "bg-green-100 text-green-700"
      : order.status === "Đang giao"
      ? "bg-blue-100 text-blue-700"
      : order.status === "Đã hủy"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="flex-1 p-3 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">
        Chi tiết đơn hàng #{order.id}
      </h2>

      {/* ===== INFO ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">👤 Khách hàng</h3>
          <p>{order.fullname}</p>
          <p>{order.phone}</p>
          <p className="text-gray-500">{order.address}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">📦 Đơn hàng</h3>
          <p>Ngày: {order.date}</p>
          <p>Thanh toán: {order.paymentMethod}</p>
          <p>TT thanh toán: {order.paymentStatus}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">🚦 Trạng thái</h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
          >
            {order.status}
          </span>

          <p className="mt-4 text-lg font-semibold text-red-600">
            Tổng tiền: {order.total.toLocaleString()}đ
          </p>
        </div>
      </div>

      {/* ===== PRODUCTS ===== */}
      <div className="bg-white p-4 rounded-lg border my-5 overflow-x-auto">
        <h3 className="font-medium mb-4">🛒 Sản phẩm</h3>

        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-2 text-left">Sản phẩm</th>
              <th className="p-2 text-center">Giá</th>
              <th className="p-2 text-center hidden md:table-cell">
                SL
              </th>
              <th className="p-2 text-center">Thành tiền</th>
            </tr>
          </thead>

          <tbody>
            {order.products.map((p, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-2 flex items-center gap-3 min-w-[220px]">
                  <img
                    src={p.image}
                    className="w-14 h-14 rounded-lg border"
                  />
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm line-through text-gray-400">
                      {p.priceOld.toLocaleString()}đ
                    </p>
                  </div>
                </td>

                <td className="p-2 text-center">
                  {p.price.toLocaleString()}đ
                </td>

                <td className="p-2 text-center hidden md:table-cell">
                  {p.quantity}
                </td>

                <td className="p-2 text-center font-medium">
                  {(p.price * p.quantity).toLocaleString()}đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== ACTION ===== */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          Huỷ đơn
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Đổi địa chỉ
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          Quay lại
        </button>
      </div>
    </div>
  );
}
