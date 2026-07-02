import React from "react";
import type { OrderItem } from "../types/orderItem.type";

interface OrderItemListProps {
  orderItems: OrderItem[];
  grandTotal: string;
}

const OrderItemList: React.FC<OrderItemListProps> = ({
  orderItems,
  grandTotal,
}) => {
  return (
    <div className="card-custom p-4">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Danh sách sản phẩm</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="py-2">Mã item</th>
              <th className="py-2">Sản phẩm</th>
              <th className="py-2">Số lượng</th>
              <th className="py-2">Đơn giá</th>
              <th className="py-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item.id} className="border-b last:border-none">
                <td className="py-3 font-medium text-slate-800">{item.id}</td>
                <td className="py-3 text-slate-700">{item.product}</td>
                <td className="py-3 text-slate-700">{item.quantity}</td>
                <td className="py-3 text-slate-700">{item.unitPrice}</td>
                <td className="py-3 font-medium text-slate-900">{item.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="pt-4 text-right font-medium text-slate-700">
                Tổng cộng:
              </td>
              <td className="pt-4 text-base font-semibold text-indigo-700">{grandTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderItemList;
