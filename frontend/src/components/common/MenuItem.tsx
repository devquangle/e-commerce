
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
                    <li key={item.id}>
                        <a href="">
                            {item.label}
                        </a>
                    </li>
                ))
            }

        </ul>
    )
}
