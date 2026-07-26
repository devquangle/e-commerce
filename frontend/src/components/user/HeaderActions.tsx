import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { useCartCount } from "@/modules/user/cart/hooks/useCart";
import HeaderActionsSkeleton from "./HeaderActionsSkeleton";

type MenuAccount = {
  id: number;
  label: string;
  path?: string;
  action?: () => void;
};

const guestMenu: MenuAccount[] = [
  { id: 1, label: "Đăng nhập", path: "/login" },
  { id: 2, label: "Đăng ký", path: "/register" },
];

interface HeaderActionsProps {
  onLogoutClick?: () => void;
}

export default function HeaderActions({ onLogoutClick }: HeaderActionsProps) {
  const [openAccount, setOpenAccount] = useState(false);
  const { isInitialized, userInfo } = useAuth();
  const { data: cartCount } = useCartCount();

  if (!isInitialized) {
    return <HeaderActionsSkeleton />;
  }

  const userMenu: MenuAccount[] = [
    { id: 1, label: "Thông tin cá nhân", path: "/account/profile" },
    { id: 2, label: "Đơn hàng", path: "/account/orders" },
    { id: 3, label: "Đăng xuất", action: onLogoutClick },
  ];

  const menuItems = userInfo ? userMenu : guestMenu;

  const user_code = () => {
    const username = userInfo?.code ? userInfo.code : "Account";
    return username;
  };

  return (
    <div className="flex items-center gap-4">
      {/* icon favorite */}
      <Link
        to="/account/favorites"
        className="hidden lg:flex justify-center items-center gap-2 text-indigo-500 hover:text-indigo-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </Link>

      {/* icon cart */}
      <Link
        to="/cart"
        className="hidden lg:flex relative justify-center items-center gap-2 text-indigo-500 hover:text-indigo-600 transition-colors"
      >
        <svg
          className="w-8 h-8"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center">
          {cartCount?.count || 0}
        </span>
      </Link>

      {/* icon menu */}
      <div
        className="relative group"
        onMouseEnter={() => setOpenAccount(true)}
        onMouseLeave={() => setOpenAccount(false)}
      >
        <button
          onClick={() => setOpenAccount(!openAccount)}
          className="flex items-center gap-2 rounded-full border px-2 py-1 cursor-pointer"
        >
          <img
            src={userInfo?.image || "https://i.pravatar.cc/40"}
            className="h-8 w-8 rounded-full"
            alt="User Avatar"
          />

          <span className="max-w-sx truncate hidden lg:block">
            {user_code()}
          </span>
        </button>

        <div
          className={`absolute top-full right-0 pt-2 z-50 transition-all duration-200 origin-top-right
            ${
              openAccount
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
            }
            `}
        >
          <div className="w-56 bg-white border rounded-lg shadow-lg">
            <ul className="p-2 text-md">
              {menuItems.map((item) => (
                <li key={item.id} className="px-4 py-2 rounded hover:bg-gray-100">
                  {item.path ? (
                    <Link
                      className="block w-full hover:text-indigo-500"
                      to={item.path}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className="hover:text-red-500 hover:cursor-pointer w-full text-left"
                      onClick={() => {
                        setOpenAccount(false);
                        item.action?.();
                      }}
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export { HeaderActionsSkeleton };
