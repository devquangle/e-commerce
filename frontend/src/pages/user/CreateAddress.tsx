import FormAddAddress from "@/modules/user/address/components/FormAddAddress";

export default function CreateAddress() {
    return (
        <div className="flex-1 p-2">
            <h2 className="text-xl font-semibold mb-4">
                Thêm địa chỉ mới
            </h2>

            <FormAddAddress />
        </div>
    );
}