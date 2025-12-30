import React, { useState } from "react";

type Order = {
  id: number;
  fullname: string;
  phone: string;
  address: string;
  total: number;
  status: "Đang xử lý" | "Đang giao" | "Hoàn thành" | "Đã hủy";
  paymentMethod: "Tiền mặt" | "Ví điện tử" | "Thẻ tín dụng";
  date: string; // YYYY-MM-DD
};

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const orders: Order[] = [
    {
      id: 1,
      fullname: "Nguyen Van A",
      phone: "0901234567",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      total: 250000,
      status: "Hoàn thành",
      paymentMethod: "Tiền mặt",
      date: "2025-12-01",
    },
    {
      id: 2,
      fullname: "Tran Thi B",
      phone: "0912345678",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
      total: 520000,
      status: "Đang giao",
      paymentMethod: "Ví điện tử",
      date: "2025-12-15",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;

    const statusMatch = statusFilter ? order.status === statusFilter : true;
    const dateMatch =
      (!start || orderDate >= start) && (!end || orderDate <= end);

    return statusMatch && dateMatch;
  });

  // Hàm format ngày từ YYYY-MM-DD sang DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}/${(
      d.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  return (
    <div className="flex-1 p-2">
      <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
        Danh sách đơn hàng
      </h2>

      {/* Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ngày bắt đầu"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ngày kết thúc"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-3 py-1 text-sm rounded ${statusFilter === null
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Tất cả
          </button>
          {["Đang xử lý", "Đang giao", "Hoàn thành", "Đã hủy"].map(
            (status) => (
              <button
                key={status}
                onClick={() =>
                  setStatusFilter(statusFilter === status ? null : status)
                }
                className={`px-3 py-1 text-sm rounded ${statusFilter === status
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders */}
      <div className="grid grid-cols-1 gap-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-3 shadow-sm hover:shadow-md bg-white flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            {/* Thông tin người nhận + ngày */}
            <div className="flex flex-1 justify-between w-full md:w-auto md:space-x-6 p-3">
              <div className="flex-1 space-y-1 text-sm">
                <p className="font-medium text-gray-800">{order.fullname}</p>
                <p className="text-gray-600">{order.phone}</p>
                <p className="text-gray-600">{order.address}</p>
                <p className="text-gray-500 text-xs">Ngày đặt: {formatDate(order.date)}</p>
              </div>

              {/* Thông tin đơn hàng */}
              <div className="flex flex-col justify-between mt-2 md:mt-0 space-y-0.5 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Tổng tiền:</span>{" "}
                  {order.total.toLocaleString("vi-VN")}₫
                </p>
                <p>
                  <span className="font-medium">Trạng thái:</span>{" "}
                  <span
                    className={`p-2${order.status === "Hoàn thành"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Đang giao"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Đang xử lý"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                      }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Thanh toán:</span>{" "}
                  {order.paymentMethod}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col gap-2">
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Mua lại
              </button>
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Chi tiết
              </button>
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                Huỷ đơn
              </button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500 text-sm">Không có đơn hàng nào</p>
        )}
      </div>
    </div>
  );
}
