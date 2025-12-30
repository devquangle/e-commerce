
import { Link } from "react-router-dom"
import Container from "../Container"
import MenuItem from "./MenuItem"
import Search from "./Search"
import { useState } from "react";
import Logo from "./Logo";
import MobileDrawer from './MobileDrawer';



export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <Container className="px-4 md:px-8">
        <nav className="flex justify-between items-center h-15 gap-2">
          <Logo />
          <MenuItem className="hidden lg:flex items-center gap-5 text-md" />
          <Search />
          <div className="flex items-center">
            {/* icon cart */}
            <button className="flex justify-center items-center gap-2 cursor-pointer">
              <svg className="w-8 h-8 text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
              </svg>
            </button>
            {/* icon menu */}
            <button className="lg:hidden cursor-pointer" onClick={() => setIsMobileNavOpen(true)}>
              <svg className="w-8 h-8 text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6" />
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
                    <li><Link to={"/account"} className="px-4 py-2 hover:text-blue-500">Thông tin cá nhân</Link></li>
                      <li><Link to="" className="px-4 py-2 hover:text-blue-500">Đơn hàng</Link></li>
                    <li className="border-t my-1" />
                    <li><Link to="" className="px-4 py-2 hover:text-blue-500">Đăng xuất</Link></li>
                    <li><Link to={"/login"} className="px-4 py-2 hover:text-blue-500">Đăng nhập</Link></li>
                    <li><Link to={"/register"} className="px-4 py-2 hover:text-blue-500">Đăng ký</Link></li>
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
