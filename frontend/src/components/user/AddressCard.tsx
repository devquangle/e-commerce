import type { AddressResponse } from '@/types/address'

type AddressCardProps = {
    item: AddressResponse,
    onEdit: (id: number) => void,
    onDelete: (id: number) => void,
    onSetDefault: (id: number) => void,
}
export default function AddressCard({ item, onEdit, onDelete, onSetDefault }: AddressCardProps) {
    return (
        <div
            key={item.id}
            className={`border rounded-xl p-4 flex flex-col justify-between shadow-sm transition hover:shadow-md
              ${item.default ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}
            `}
        >
            <div className="space-y-1">
                <p className="font-medium text-gray-800">{item?.fullName}</p>
                <p className="text-gray-600">{item?.phone}</p>
                <p className="text-gray-600">{item?.streetFull}</p>
            </div>

            <div className="flex items-center gap-2 mt-3">
                {item.default ? (
                    <span className="px-2 py-1 text-xs text-white bg-blue-500 rounded">Mặc định</span>
                ) : (
                    <button
                        onClick={() => onSetDefault(item.id!)}
                        className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer"
                    >
                        Đặt mặc định
                    </button>
                )}

                <button
                    onClick={() => onEdit(item?.id)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                >
                    Sửa
                </button>
                {
                    !item.default && (
                        <button
                            onClick={() => onDelete(item.id!)}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                        >
                            Xóa
                        </button>
                    )

                }

            </div>
        </div>
    )
}
