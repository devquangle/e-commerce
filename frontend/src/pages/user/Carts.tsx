import Container from "@/components/Container"
import React, { useState } from "react"

interface Product {
    id: number
    title: string
    image: string
    price: number
    quantity: number
    checked: boolean
}

export default function Carts() {
    const [products] = useState<Product[]>([
        {
            id: 1,
            title: "Đắc Nhân Tâm",
            image: "https://via.placeholder.com/200x300",
            price: 150000,
            quantity: 1,
            checked: true,
        },
        {
            id: 2,
            title: "Tư Duy Nhanh Và Chậm",
            image: "https://via.placeholder.com/200x300",
            price: 350000,
            quantity: 2,
            checked: false,
        },
    ])

    return (
        <Container className="px-3 md:px-8">
            <div className="py-4">
                {/* ================= TABLE ================= */}
                <div className="overflow-x-auto rounded-lg border bg-white">
                    <table className="w-full border-collapse text-sm">
                        {/* ===== HEAD (DESKTOP) ===== */}
                        <thead className="border-b hidden md:table-header-group">
                            <tr className="text-gray-500 " >
                                <th className="p-3 w-[10%]">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" />
                                        <span>Tất cả</span>
                                    </div>
                                </th>
                                <th className="p-3">Sách</th>
                                <th className="p-3 text-center">Số cuốn</th>
                                <th className="p-3 text-right">Giá</th>
                                <th className="p-3 text-right">Tạm tính</th>
                                <th className="p-3 w-[10%]">  </th>                         
                            </tr>
                        </thead>

                        {/* ===== BODY ===== */}
                        <tbody>
                            {products.map(item => (
                                <tr
                                    key={item.id}
                                    className="border"
                                >
                             
                                   
                                    <td className="p-3 w-[10%]" >
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            className="flex justify-start items-start "
                                        />
                                    </td>
                                    <td className=" md:table-cell block">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium line-clamp-2">
                                                {item.title}
                                            </span>

                                            <span className="text-xs text-gray-500">
                                                Sách giấy · Bìa mềm
                                            </span>

                                            <span className="text-gray-600 md:hidden">
                                                Giá: {item.price.toLocaleString()}₫
                                            </span>
                                        </div>
                                    </td>
                                    {/* ===== QUANTITY ===== */}
                                    <td className="p-3 md:table-cell block">
                                        <span className="md:hidden text-xs text-gray-500 mb-1 block">
                                            Số lượng
                                        </span>
                                        <div className="flex md:justify-center">
                                            <div className="flex border rounded overflow-hidden">
                                                <button className="px-3 bg-gray-100 active:scale-95">
                                                    −
                                                </button>
                                                <input
                                                    type="text"
                                                    value={item.quantity}
                                                    disabled
                                                    className="w-12 text-center border-x"
                                                />
                                                <button className="px-3 bg-gray-100 active:scale-95">
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    {/* ===== PRICE (DESKTOP) ===== */}
                                    <td className="p-3 text-right hidden md:table-cell">
                                        {item.price.toLocaleString()}₫
                                    </td>

                                    {/* ===== TOTAL ===== */}
                                    <td className="p-3 md:table-cell block text-right">
                                        <span className="md:hidden text-xs text-gray-500">
                                            Tạm tính:
                                        </span>
                                        <span className="font-semibold text-red-600 text-base">
                                            {(item.price * item.quantity).toLocaleString()}₫
                                        </span>
                                    </td>

                                    {/* ===== ACTION ===== */}
                                    <td className="p-3 md:table-cell block text-right">
                                        <button className="px-3 py-1 bg-red-500 text-white rounded active:scale-95">
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ================= TOTAL BAR ================= */}
                <div className="mt-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between border rounded p-4 bg-white">
                    <div className="text-sm md:text-lg">
                        <p>
                            Sách đã chọn: <b>6 cuốn</b>
                        </p>
                        <p className="text-red-600 font-semibold text-lg">
                            Tổng tiền: 2.000.000₫
                        </p>
                    </div>

                    <button className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded text-center text-base font-medium active:scale-95">
                        Đặt mua
                    </button>
                </div>
            </div>
        </Container>
    )
}
