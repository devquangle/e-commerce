
import { Link } from "react-router-dom"
import Container from "../Container"

import { useState } from "react";
import Logo from "../user/Logo";
import Search from "../user/Search";
import MobileDrawer from "./MobileDrawer";

type MenuAccount = {
    id: number,
    label: string,
    path: string
}

const menuItems: MenuAccount[] = [
    { id: 1, label: "Đăng nhập", path: "/login" },
    { id: 2, label: "Đăng ký", path: "/register" },
    { id: 3, label: "Thông tin cá nhân", path: "/account/profile" },
    { id: 4, label: "Đơn hàng", path: "/account/orders" },
]

export default function Header() {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);
    return (
        <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
            <Container className="px-2 md:px-4">
                <nav className="flex justify-between items-center h-15 gap-2">
                    <Logo />

                    <Search />
                    <div className="flex items-center">

                        {/* icon menu */}
                        <button className="lg:hidden cursor-pointer" onClick={() => setIsMobileNavOpen(true)}>
                            <svg className="w-8 h-8 text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M18 6H6m12 4H6m12 4H6m12 4H6"
                                />
                            </svg>
                        </button>

                        <div className="relative group hidden lg:block">
                            <button className="flex items-center gap-2 rounded-full border px-2 py-1">
                                <img src="https://i.pravatar.cc/40" className="h-8 w-8 rounded-full" />
                                <span className="text-md">Tài khoản</span>
                            </button>
                            <div className="absolute top-full right-0 pt-2 z-50 opacity-0 invisible translate-y-2 transition group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                                <div className="w-56 bg-white border rounded-lg shadow-lg ">
                                    <ul className="p-2 text-md">
                                        {menuItems.map((item) => (
                                            <li key={item.id} className="w-full p-2  hover:bg-gray-100 hover:text-blue-500">
                                                <Link to={item.path} className="px-4 py-2">
                                                    {item.label}
                                                </Link>
                                            </li>
                                        ))}

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </Container>
            <MobileDrawer
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
                isAccountOpen={isMobileAccountOpen}
                setIsAccountOpen={setIsMobileAccountOpen} />

        </header>
    )
}
