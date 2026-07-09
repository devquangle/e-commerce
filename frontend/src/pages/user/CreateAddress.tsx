import FormAddAddress from "@/modules/user/address/components/FormAddAddress";
import { useNavigate } from "react-router-dom";

export default function CreateAddress() {
    const navigate = useNavigate();
    return (
        <div className="flex-1 p-2">
            <h2 className="text-xl font-semibold mb-4">
                Thêm địa chỉ mới
            </h2>

            <FormAddAddress onSuccess={() => navigate("/account/address")} />
        </div>
    );
}