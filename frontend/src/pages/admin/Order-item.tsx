import type { OrderItem as OrderItemType } from "@/modules/admin/order-item/types/orderItem.type";
import OrderItemSummary from "@/modules/admin/order-item/components/OrderItemSummary";
import OrderItemList from "@/modules/admin/order-item/components/OrderItemList";

const orderItems: OrderItemType[] = [
  { id: "ITEM001", product: "iPhone 15 Pro", quantity: 1, unitPrice: "28.990.000đ", total: "28.990.000đ" },
  { id: "ITEM002", product: "Ốp lưng Silicon", quantity: 2, unitPrice: "250.000đ", total: "500.000đ" },
  { id: "ITEM003", product: "Cáp sạc Type-C", quantity: 1, unitPrice: "190.000đ", total: "190.000đ" },
];

export default function OrderItem() {
  return (
    <section className="space-y-6 p-4 flex-1 flex flex-col gap-4">
      {/* HEADER WITH card-custom */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between card-custom p-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chi tiết đơn hàng</h1>
          <p className="text-sm text-slate-500">Theo dõi từng sản phẩm trong đơn và giá trị thanh toán.</p>
        </div>
        <button className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer active:scale-95">
          Quay lại danh sách đơn
        </button>
      </div>

      <OrderItemSummary
        orderCode="#DH1024"
        customerName="Nguyen Van A"
        status="Đang xử lý"
      />

      <OrderItemList
        orderItems={orderItems}
        grandTotal="29.680.000đ"
      />
    </section>
  );
}
