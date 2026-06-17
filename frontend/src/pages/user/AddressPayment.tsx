import Container from "@/components/common/Container";
import type { AddressResponse } from "@/types/address";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockAddresses: AddressResponse[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    phone: "0901 234 567",
    street: "123 Nguyễn Huệ",
    streetFull: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    default: true,
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    phone: "0912 345 678",
    street: "456 Lê Lợi",
    streetFull: "456 Lê Lợi, Phường 1, Quận 3, TP. Hồ Chí Minh",
    default: false,
  },
];

const STORAGE_KEY = "payment_selected_address_id";

export default function AddressPayment() {
  const navigate = useNavigate();
  const savedId = Number(sessionStorage.getItem(STORAGE_KEY));
  const initialId =
    mockAddresses.find((a) => a.id === savedId)?.id ??
    mockAddresses.find((a) => a.default)?.id ??
    mockAddresses[0]?.id;

  const handleSelect = (id: number) => {
    sessionStorage.setItem(STORAGE_KEY, String(id));
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Container className="max-w-2xl px-4 md:px-6 py-6 md:py-10">
        <div className="flex items-center gap-2 mb-6">
          <MapPin size={20} className="text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">
            Chọn địa chỉ giao hàng
          </h1>
        </div>

        <div className="space-y-3">
          {mockAddresses.map((addr) => (
            <button
              key={addr.id}
              type="button"
              onClick={() => handleSelect(addr.id)}
              className={`w-full text-left p-4 rounded-2xl border transition ${
                initialId === addr.id
                  ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-200"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-slate-800">
                  {addr.fullName}
                </span>
                <span className="text-xs text-slate-500">{addr.phone}</span>
                {addr.default && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-600 text-white">
                    Mặc định
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {addr.streetFull}
              </p>
            </button>
          ))}
        </div>
      </Container>
    </div>
  );
}

export { STORAGE_KEY as PAYMENT_ADDRESS_STORAGE_KEY };
