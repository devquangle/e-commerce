import { Link } from "react-router-dom"

const menuItems = [
    {
        id: 1,
        label: "Trang chủ",
        path: "/home"
    },
    {
        id: 2,
        label: "Sản phẩm",
        path: "/products"
    },

    {
        id: 3,
        label: "Giới hiệu",
        path: "/products"
    },
    {
        id: 4,
        label: "Liên hệ",
        path: "/products"
    },

    {
        id: 5,
        label: "Blogs",
        path: "/products"
    },
]

export default function MenuItem({ className = "" }) {
    return (
        <ul className={className}>
            {
                menuItems.map((item) => (

                    <li key={item.id} >
                        <Link to={item.path} className="hover:text-indigo-500">
                            {item.label}
                        </Link>
                    </li>
                ))
            }
        </ul>
    )
}
