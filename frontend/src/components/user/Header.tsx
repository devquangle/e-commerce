
import { Link } from "react-router-dom"
import Container from "../common/Container"
import MenuItem from "./MenuItem"
import Search from "./Search"
import { useState } from "react";
import Logo from "./Logo";
import MobileDrawer from './MobileDrawer';
import { useAuth } from "@/context/useAuth";
import Modal from "../common/Modal";

type MenuAccount = {
  id: number,
  label: string,
  path?: string,
  action?: () => void
}

const guestMenu: MenuAccount[] = [
  { id: 1, label: "Đăng nhập", path: "/login" },
  { id: 2, label: "Đăng ký", path: "/register" },
];


export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [open, setOpen] = useState(false);
  const { isInitialized, userInfo, logout } = useAuth();
  const userMenu: MenuAccount[] = [
    { id: 1, label: "Thông tin cá nhân", path: "/account/profile" },
    { id: 2, label: "Đơn hàng", path: "/account/orders" },
    { id: 3, label: "Đăng xuất", action: () => setOpen(true) },
  ];
  const menuItems = (isInitialized && userInfo) ? userMenu : guestMenu;
    const user_code = () => {
        const username = (isInitialized && userInfo?.code) ? userInfo.code : "Account";
        return username;
    }
  return (
    <>
      <header className="sticky  top-0 z-30 border-b bg-white/80 backdrop-blur ">
        <Container className="max-w-7xl px-4 md:px-8">
          <nav className="flex justify-between items-center h-15 gap-2">
            <Logo />
            <button className="lg:hidden cursor-pointer" onClick={() => setIsMobileNavOpen(true)}>
              <svg className="w-8 h-8 text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6H6m12 4H6m12 4H6m12 4H6" />
              </svg>
            </button>
            <MenuItem className="hidden lg:flex items-center gap-5 text-md" />
            <Search />
            <div className="flex items-center gap-4">
              {/* icon cart */}
              <Link to={"/carts"} className="hidden lg:flex justify-center items-center gap-2  ">
                <svg className="w-8 h-8 text-indigo-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
                </svg>
              </Link>
              {/* icon menu */}
              <div
                className="relative group "
                onMouseEnter={() => setOpenAccount(true)}
                onMouseLeave={() => setOpenAccount(false)}
              >
                <button
                  onClick={() => setOpenAccount(!openAccount)}
                  className="flex items-center gap-2 rounded-full border px-2 py-1 cursor-pointer"
                >
                  <img
                    src="https://i.pravatar.cc/40"
                    className=" h-8 w-8 rounded-full"
                  />

                  <span className="max-w-sx truncate block">
                    {user_code()}
                  </span>
                </button>

                <div
                  className={`absolute top-full right-0 pt-2 z-50 transition-all duration-200 origin-top-right
                    ${openAccount
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}
                    `}
                >
                  <div className="w-56 bg-white border rounded-lg shadow-lg">
                    <ul className="p-2 text-md">
                      {menuItems.map((item) => (
                        <li key={item.id} className="px-4 py-2 rounded hover:bg-gray-100">
                          {item.path ? (
                            <Link className="block w-full hover:text-indigo-500" to={item.path}>{item.label}</Link>
                          ) : (
                            <button className="hover:text-red-500 hover:cursor-pointer" onClick={item.action}>{item.label}</button>
                          )}
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
        />

      </header>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          {
            setOpen(false);
            logout();
          }

        }}
        title="Xác nhận đăng xuất"
        content="Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng?"
        confirmText="Xác nhận"
      />
    </>
  )
}
