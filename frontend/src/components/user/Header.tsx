import { useState } from "react";
import Container from "../common/Container";
import MenuItem from "./MenuItem";
import Search from "./Search";
import Logo from "./Logo";
import MobileDrawer from "./MobileDrawer";
import { useAuth } from "@/context/useAuth";
import Modal from "../common/Modal";
import HeaderActions from "./HeaderActions";

export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <Container className="max-w-7xl p-2">
          <nav className="flex justify-between items-center h-15 gap-2 relative">
            <Logo />
            <button
              className="lg:hidden cursor-pointer"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <svg
                className="w-8 h-8 text-indigo-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 6H6m12 4H6m12 4H6m12 4H6"
                />
              </svg>
            </button>
            <MenuItem className="hidden lg:flex items-center gap-5 text-md" />
            <Search />
            <HeaderActions onLogoutClick={() => setOpen(true)} />
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
        onConfirm={async () => {
          setOpen(false);
          await logout();
        }}
        title="Xác nhận đăng xuất"
        content="Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng?"
        confirmText="Xác nhận"
      />
    </>
  );
}
