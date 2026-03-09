import { Link } from "react-router-dom"

const menuItems = [
    {
        id: 1,
        label: "Dashboard",
        path: "/dashboard",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" />
            </svg>
        )
    },

    {
        id: 2,
        label: "Sản phẩm",
        path: "/products",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3h12l-1 14H5L4 3z" />
            </svg>
        )
    },

    {
        id: 3,
        label: "Thể loại",
        path: "/categories",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4h6v6H3V4zm8 0h6v6h-6V4zM3 12h6v6H3v-6zm8 0h6v6h-6v-6z" />
            </svg>
        )
    },

    {
        id: 4,
        label: "Kho hàng",
        path: "/inventory",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6l8-4 8 4v10H2V6zm3 2v6h10V8H5z" />
            </svg>
        )
    },

    {
        id: 5,
        label: "Đơn hàng",
        path: "/orders",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 2h8l4 6v10H2V8l4-6z" />
            </svg>
        )
    },

    {
        id: 6,
        label: "Giảm giá",
        path: "/promotions",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.707 9.293l-7-7A1 1 0 0010 2H3a1 1 0 00-1 1v7a1 1 0 00.293.707l7 7a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
            </svg>
        )
    },

    {
        id: 7,
        label: "Banner",
        path: "/banners",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3h16v10H2V3zm3 12h10v2H5v-2z" />
            </svg>
        )
    },

    {
        id: 8,
        label: "Chat",
        path: "/chats",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3h16v10H5l-3 3V3z" />
            </svg>
        )
    },

    {
        id: 9,
        label: "Đánh giá",
        path: "/reviews",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09L5.64 11.545 1 7.91l6.061-.545L10 2l2.939 5.364L19 7.91l-4.64 3.636 1.518 6.545z" />
            </svg>
        )
    },

    {
        id: 10,
        label: "Khách hàng",
        path: "/customers",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" />
            </svg>
        )
    },

    {
        id: 11,
        label: "Thống kê",
        path: "/analytics",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3h2v14H3V3zm6 4h2v10H9V7zm6-4h2v14h-2V3z" />
            </svg>
        )
    },

    {
        id: 12,
        label: "Tài khoản admin",
        path: "/users",
        icon: (
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 1112 0H4z" />
            </svg>
        )
    }
]

export default function MenuItem({ className = "" }) {
    return (
        <ul className={className}>
            {
                menuItems.map((item) => (

                    <li key={item.id} >
                        <Link to={item.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 hover:text-indigo-500">
                            {item.icon}
                            {item.label}
                        </Link>
                    </li>
                ))
            }
        </ul>
    )
}
