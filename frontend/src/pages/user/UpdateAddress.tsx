import FormUpdateAddress from "@/modules/user/address/components/FormUpdateAddress";

export default function UpdateAddress() {
    return (
        <div className="flex-1 p-2">
            <h2 className="text-xl font-semibold mb-4">
                Cập nhật địa chỉ
            </h2>
            <FormUpdateAddress />
        </div>
    );
}