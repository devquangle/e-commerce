import FormUpdateAddress from "@/modules/user/address/components/FormUpdateAddress";
import { useNavigate } from "react-router-dom";

export default function UpdateAddress() {
    const navigate = useNavigate();
    return (
        <div className="flex-1 p-2">
            <h2 className="text-xl font-semibold mb-4">
                Cập nhật địa chỉ
            </h2>
            <FormUpdateAddress onSuccess={() => navigate("/account/address")} />
        </div>
    );
}