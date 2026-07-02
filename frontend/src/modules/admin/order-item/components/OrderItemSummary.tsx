import React from "react";

interface OrderItemSummaryProps {
  orderCode: string;
  customerName: string;
  status: string;
}

const OrderItemSummary: React.FC<OrderItemSummaryProps> = ({
  orderCode,
  customerName,
  status,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <article className="card-custom p-4">
        <p className="text-sm text-slate-500">Mã đơn</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{orderCode}</p>
      </article>
      <article className="card-custom p-4">
        <p className="text-sm text-slate-500">Khách hàng</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{customerName}</p>
      </article>
      <article className="card-custom p-4">
        <p className="text-sm text-slate-500">Trạng thái</p>
        <p className="mt-1 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-705">
          {status}
        </p>
      </article>
    </div>
  );
};

export default OrderItemSummary;
